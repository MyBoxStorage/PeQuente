'use client';

import { useState, useEffect, useRef } from 'react';

// Tipos para o detector
interface PoseDetector {
  estimatePoses: (image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement, config?: any) => Promise<any[]>;
  dispose: () => void;
  reset: () => void;
}

interface UseMediaPipePoseReturn {
  detector: PoseDetector | null;
  isLoading: boolean;
  error: string | null;
}

// URLs do CDN - Carregando módulos separados para evitar WebGPU
const CDN_URLS = {
  // TensorFlow.js Core (sem backends)
  tfjsCore: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@4.17.0/dist/tf-core.min.js',
  // Backend WebGL apenas (sem WebGPU)
  tfjsWebgl: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@4.17.0/dist/tf-backend-webgl.min.js',
  // Pose Detection API
  poseDetection: 'https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.0/dist/pose-detection.min.js',
};

// Cache para evitar recarregar scripts
const scriptsLoaded = new Set<string>();
let tfInitialized = false;

/**
 * Carrega um script dinamicamente
 */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (scriptsLoaded.has(src)) {
      resolve();
      return;
    }

    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      scriptsLoaded.add(src);
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timeout carregando script`));
    }, 30000);
    
    script.onload = () => {
      clearTimeout(timeoutId);
      scriptsLoaded.add(src);
      resolve();
    };
    
    script.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error(`Falha ao carregar script`));
    };
    
    document.head.appendChild(script);
  });
}

/**
 * Aguarda objeto global
 */
function waitForGlobal(name: string, timeout = 15000): Promise<any> {
  return new Promise((resolve, reject) => {
    const win = window as any;
    
    if (win[name]) {
      resolve(win[name]);
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (win[name]) {
        clearInterval(checkInterval);
        resolve(win[name]);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error(`Timeout aguardando ${name}`));
      }
    }, 50);
  });
}

/**
 * Inicializa TensorFlow.js com backend WebGL
 */
async function initializeTensorFlow(): Promise<any> {
  if (tfInitialized) {
    return (window as any).tf;
  }

  console.log('[TF] Carregando TensorFlow.js Core...');
  await loadScript(CDN_URLS.tfjsCore);
  const tf = await waitForGlobal('tf', 15000);
  
  console.log('[TF] Carregando backend WebGL...');
  await loadScript(CDN_URLS.tfjsWebgl);
  
  // Aguardar backend registrar
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Verificar backends disponíveis
  const backends = tf.engine().registryFactory;
  console.log('[TF] Backends disponíveis:', Object.keys(backends));
  
  // Definir WebGL como backend
  if (backends['webgl']) {
    await tf.setBackend('webgl');
    console.log('[TF] Backend definido: webgl');
  } else if (backends['cpu']) {
    await tf.setBackend('cpu');
    console.log('[TF] Backend definido: cpu (fallback)');
  } else {
    throw new Error('Nenhum backend compatível disponível');
  }
  
  // Aguardar TensorFlow.js estar pronto
  await tf.ready();
  console.log('[TF] ✅ Pronto! Backend:', tf.getBackend());
  
  tfInitialized = true;
  return tf;
}

/**
 * Hook para MediaPipe Pose Detection
 * Usa TensorFlow.js com backend WebGL (compatível com mobile)
 */
export function useMediaPipePose(): UseMediaPipePoseReturn {
  const [detector, setDetector] = useState<PoseDetector | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const detectorRef = useRef<PoseDetector | null>(null);
  const isMountedRef = useRef(true);
  const initStartedRef = useRef(false);

  useEffect(() => {
    if (initStartedRef.current) return;
    initStartedRef.current = true;
    isMountedRef.current = true;

    async function initializeDetector() {
      const startTime = Date.now();
      
      try {
        setIsLoading(true);
        setError(null);

        // 1. Inicializar TensorFlow.js
        await initializeTensorFlow();
        
        if (!isMountedRef.current) return;

        // 2. Carregar Pose Detection
        console.log('[Pose] Carregando Pose Detection...');
        await loadScript(CDN_URLS.poseDetection);
        const poseDetection = await waitForGlobal('poseDetection', 15000);

        if (!isMountedRef.current) return;

        if (!poseDetection?.createDetector) {
          throw new Error('API de detecção não disponível');
        }

        // 3. Criar detector BlazePose
        console.log('[Pose] Criando detector BlazePose...');
        const model = poseDetection.SupportedModels.BlazePose;
        
        const createdDetector = await poseDetection.createDetector(model, {
          runtime: 'tfjs',
          modelType: 'lite',
          enableSmoothing: true,
        });

        if (!isMountedRef.current) {
          createdDetector?.dispose?.();
          return;
        }

        const loadTime = Date.now() - startTime;
        console.log(`[Pose] ✅ Detector pronto em ${loadTime}ms`);

        detectorRef.current = createdDetector;
        setDetector(createdDetector);
        setIsLoading(false);
        
      } catch (err) {
        console.error('[Pose] ❌ Erro:', err);
        if (isMountedRef.current) {
          const message = err instanceof Error ? err.message : 'Erro ao carregar';
          setError(message);
          setIsLoading(false);
        }
      }
    }

    initializeDetector();

    return () => {
      isMountedRef.current = false;
      if (detectorRef.current?.dispose) {
        try {
          detectorRef.current.dispose();
        } catch (e) {
          // Ignorar erros de cleanup
        }
        detectorRef.current = null;
      }
    };
  }, []);

  return { detector, isLoading, error };
}
