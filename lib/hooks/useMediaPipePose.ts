'use client';

import { useState, useEffect, useRef } from 'react';

// Tipos para o detector
interface PoseDetector {
  estimatePoses: (
    image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
    config?: { flipHorizontal?: boolean }
  ) => Promise<any[]>;
  dispose: () => void;
  reset: () => void;
}

interface UseMediaPipePoseReturn {
  detector: PoseDetector | null;
  isLoading: boolean;
  error: string | null;
}

// Estado global para evitar múltiplas inicializações
let globalTfInitialized = false;
let globalTfPromise: Promise<any> | null = null;

/**
 * Carrega um script dinamicamente com retry
 */
function loadScript(src: string, maxRetries = 2): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    let attempts = 0;
    
    const tryLoad = () => {
      attempts++;
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      
      const timeout = setTimeout(() => {
        script.remove();
        if (attempts < maxRetries) {
          console.warn(`[TF] Retry ${attempts}/${maxRetries}`);
          tryLoad();
        } else {
          reject(new Error('Timeout ao carregar biblioteca'));
        }
      }, 25000);
      
      script.onload = () => {
        clearTimeout(timeout);
        resolve();
      };
      
      script.onerror = () => {
        clearTimeout(timeout);
        script.remove();
        if (attempts < maxRetries) {
          setTimeout(tryLoad, 500);
        } else {
          reject(new Error('Falha ao carregar biblioteca'));
        }
      };
      
      document.head.appendChild(script);
    };
    
    tryLoad();
  });
}

/**
 * Aguarda condição ser verdadeira
 */
function waitFor(check: () => boolean, timeout = 15000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (check()) {
      resolve();
      return;
    }
    
    const start = Date.now();
    const interval = setInterval(() => {
      if (check()) {
        clearInterval(interval);
        resolve();
      } else if (Date.now() - start > timeout) {
        clearInterval(interval);
        reject(new Error('Timeout'));
      }
    }, 100);
  });
}

/**
 * Inicializa TensorFlow.js completo (singleton)
 */
async function initTensorFlow(): Promise<any> {
  if (globalTfPromise) {
    return globalTfPromise;
  }
  
  if (globalTfInitialized && (window as any).tf?.loadGraphModel) {
    return (window as any).tf;
  }
  
  globalTfPromise = (async () => {
    const win = window as any;
    
    try {
      // 1. Carregar TensorFlow.js Core
      console.log('[TF] 1/5 Carregando core...');
      await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@4.17.0/dist/tf-core.min.js');
      await waitFor(() => win.tf?.engine != null, 10000);
      
      // 2. Carregar Converter (contém loadGraphModel)
      console.log('[TF] 2/5 Carregando converter...');
      await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter@4.17.0/dist/tf-converter.min.js');
      await waitFor(() => typeof win.tf?.loadGraphModel === 'function', 10000);
      
      // 3. Carregar Backend WebGL
      console.log('[TF] 3/5 Carregando WebGL backend...');
      await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@4.17.0/dist/tf-backend-webgl.min.js');
      
      // Aguardar backend registrar
      await new Promise(r => setTimeout(r, 300));
      await waitFor(() => {
        try {
          const registry = win.tf?.engine?.()?.registryFactory;
          return registry?.['webgl'] != null;
        } catch {
          return false;
        }
      }, 10000);
      
      const tf = win.tf;
      
      // 4. Configurar backend
      console.log('[TF] 4/5 Configurando backend...');
      const registry = tf.engine().registryFactory;
      const backends = Object.keys(registry);
      console.log('[TF] Backends:', backends);
      
      let backendOk = false;
      
      if (backends.includes('webgl')) {
        try {
          await tf.setBackend('webgl');
          backendOk = true;
        } catch (e) {
          console.warn('[TF] WebGL falhou, tentando CPU');
        }
      }
      
      if (!backendOk && backends.includes('cpu')) {
        await tf.setBackend('cpu');
        backendOk = true;
      }
      
      if (!backendOk) {
        throw new Error('Nenhum backend disponível');
      }
      
      // 5. Finalizar
      console.log('[TF] 5/5 Finalizando...');
      await tf.ready();
      
      // Verificar funções essenciais
      if (typeof tf.loadGraphModel !== 'function') {
        throw new Error('loadGraphModel não disponível');
      }
      
      globalTfInitialized = true;
      console.log('[TF] ✅ Pronto! Backend:', tf.getBackend());
      
      return tf;
      
    } catch (err) {
      globalTfPromise = null;
      throw err;
    }
  })();
  
  return globalTfPromise;
}

/**
 * Carrega Pose Detection API
 */
async function loadPoseDetection(): Promise<any> {
  const win = window as any;
  
  if (win.poseDetection?.createDetector) {
    return win.poseDetection;
  }
  
  console.log('[Pose] Carregando API...');
  await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.0/dist/pose-detection.min.js');
  
  await waitFor(() => win.poseDetection?.createDetector != null, 15000);
  
  return win.poseDetection;
}

/**
 * Hook para MediaPipe Pose Detection
 */
export function useMediaPipePose(): UseMediaPipePoseReturn {
  const [detector, setDetector] = useState<PoseDetector | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const detectorRef = useRef<PoseDetector | null>(null);
  const mountedRef = useRef(true);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    mountedRef.current = true;

    const init = async () => {
      const start = Date.now();
      
      try {
        setIsLoading(true);
        setError(null);

        // Verificar WebGL
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
          throw new Error('WebGL não suportado');
        }

        // Inicializar TensorFlow.js
        await initTensorFlow();
        if (!mountedRef.current) return;

        // Carregar Pose Detection
        const poseDetection = await loadPoseDetection();
        if (!mountedRef.current) return;

        // Criar detector
        console.log('[Pose] Criando detector...');
        const model = poseDetection.SupportedModels.BlazePose;
        
        const det = await poseDetection.createDetector(model, {
          runtime: 'tfjs',
          modelType: 'lite',
          enableSmoothing: true,
        });

        if (!mountedRef.current) {
          det?.dispose?.();
          return;
        }

        console.log(`[Pose] ✅ Pronto em ${Date.now() - start}ms`);
        
        detectorRef.current = det;
        setDetector(det);
        setIsLoading(false);
        
      } catch (err) {
        console.error('[Pose] ❌', err);
        if (mountedRef.current) {
          setError(err instanceof Error ? err.message : 'Erro desconhecido');
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      mountedRef.current = false;
      if (detectorRef.current?.dispose) {
        try {
          detectorRef.current.dispose();
        } catch {
          // ignore
        }
        detectorRef.current = null;
      }
    };
  }, []);

  return { detector, isLoading, error };
}
