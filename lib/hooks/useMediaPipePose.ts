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

// URLs do CDN otimizadas
const CDN_URLS = {
  tfjs: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.17.0/dist/tf.min.js',
  poseDetection: 'https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.0/dist/pose-detection.min.js',
};

// Cache para evitar recarregar scripts
const loadedScripts = new Set<string>();

/**
 * Carrega um script dinamicamente (com cache)
 */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (loadedScripts.has(src)) {
      resolve();
      return;
    }

    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      loadedScripts.add(src);
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    
    script.onload = () => {
      loadedScripts.add(src);
      resolve();
    };
    
    script.onerror = () => {
      reject(new Error(`Falha ao carregar: ${src.split('/').pop()}`));
    };
    
    document.head.appendChild(script);
  });
}

/**
 * Aguarda objeto global
 */
function waitForGlobal(name: string, timeout = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    const win = window as any;
    
    if (win[name]) {
      resolve();
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (win[name]) {
        clearInterval(checkInterval);
        resolve();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error(`Timeout: ${name}`));
      }
    }, 50);
  });
}

/**
 * Verifica se WebGL está disponível
 */
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

/**
 * Hook otimizado para MediaPipe Pose Detection
 * Usa runtime TFJS com backend WebGL (compatível com mobile)
 */
export function useMediaPipePose(): UseMediaPipePoseReturn {
  const [detector, setDetector] = useState<PoseDetector | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const detectorRef = useRef<PoseDetector | null>(null);
  const isMountedRef = useRef(true);
  const initStartedRef = useRef(false);

  useEffect(() => {
    // Evitar inicialização dupla
    if (initStartedRef.current) return;
    initStartedRef.current = true;
    isMountedRef.current = true;

    async function initializeDetector() {
      const startTime = Date.now();
      
      try {
        setIsLoading(true);
        setError(null);

        // Verificar suporte a WebGL
        if (!isWebGLAvailable()) {
          throw new Error('WebGL não disponível. Seu dispositivo não suporta AR.');
        }

        // 1. Carregar TensorFlow.js
        console.log('[Pose] Carregando TensorFlow.js...');
        await loadScript(CDN_URLS.tfjs);
        await waitForGlobal('tf', 10000);
        
        if (!isMountedRef.current) return;

        // 2. Inicializar TensorFlow.js com backend WebGL (compatível com mobile)
        const tf = (window as any).tf;
        
        // Definir backend WebGL (mais compatível que WebGPU)
        try {
          await tf.setBackend('webgl');
        } catch (backendError) {
          console.warn('[Pose] WebGL backend falhou, tentando CPU...');
          await tf.setBackend('cpu');
        }
        
        // Aguardar TensorFlow.js estar completamente pronto
        await tf.ready();
        console.log('[Pose] TensorFlow.js pronto, backend:', tf.getBackend());

        if (!isMountedRef.current) return;

        // 3. Carregar Pose Detection
        console.log('[Pose] Carregando Pose Detection...');
        await loadScript(CDN_URLS.poseDetection);
        await waitForGlobal('poseDetection', 10000);

        if (!isMountedRef.current) return;

        const win = window as any;
        const poseDetection = win.poseDetection;

        if (!poseDetection?.createDetector) {
          throw new Error('API de detecção não disponível');
        }

        // 4. Criar detector BlazePose
        console.log('[Pose] Criando detector...');
        const model = poseDetection.SupportedModels.BlazePose;
        
        const createdDetector = await poseDetection.createDetector(model, {
          runtime: 'tfjs',
          modelType: 'lite', // Modelo leve para mobile
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
          const message = err instanceof Error ? err.message : 'Erro ao carregar detector';
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
