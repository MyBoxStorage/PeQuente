'use client';

import { useState, useEffect, useRef } from 'react';

// Tipos para o detector (declaração mínima)
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

// URLs do CDN para as bibliotecas necessárias
const CDN_URLS = {
  mediapipePose: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose.js',
  poseDetection: 'https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.0/dist/pose-detection.min.js',
};

// MediaPipe solution path do CDN
const MEDIAPIPE_SOLUTION_PATH = 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404';

/**
 * Carrega um script dinamicamente
 */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Verificar se o script já foi carregado
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Erro ao carregar script: ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Aguarda até que uma variável global esteja disponível
 */
function waitForGlobal(name: string, timeout = 15000): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any)[name]) {
      resolve();
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if ((window as any)[name]) {
        clearInterval(checkInterval);
        resolve();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error(`Timeout aguardando ${name}`));
      }
    }, 100);
  });
}

/**
 * Hook customizado para usar MediaPipe Pose Detection
 * Carrega scripts do CDN e inicializa o detector BlazePose com runtime MediaPipe
 */
export function useMediaPipePose(): UseMediaPipePoseReturn {
  const [detector, setDetector] = useState<PoseDetector | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const detectorRef = useRef<PoseDetector | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    async function initializeDetector() {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Carregar MediaPipe Pose primeiro
        await loadScript(CDN_URLS.mediapipePose);
        // Aguardar um pouco para garantir que o MediaPipe foi inicializado
        await new Promise(resolve => setTimeout(resolve, 100));

        // 2. Carregar Pose Detection API
        await loadScript(CDN_URLS.poseDetection);
        await waitForGlobal('poseDetection');

        if (!isMountedRef.current) return;

        // 3. Inicializar o detector BlazePose
        const poseDetection = (window as any).poseDetection;
        if (!poseDetection) {
          throw new Error('poseDetection não está disponível');
        }

        const model = poseDetection.SupportedModels?.BlazePose;
        if (!model) {
          throw new Error('BlazePose não está disponível no poseDetection');
        }

        const detectorConfig: any = {
          runtime: 'mediapipe',
          modelType: 'lite', // Modelo leve para melhor performance
          solutionPath: MEDIAPIPE_SOLUTION_PATH,
          enableSmoothing: true,
        };

        const createdDetector = await poseDetection.createDetector(model, detectorConfig);

        if (!isMountedRef.current) {
          // Se o componente foi desmontado durante a inicialização, fazer cleanup
          if (createdDetector && createdDetector.dispose) {
            createdDetector.dispose();
          }
          return;
        }

        detectorRef.current = createdDetector;
        setDetector(createdDetector);
        setIsLoading(false);
      } catch (err) {
        console.error('Erro ao inicializar MediaPipe Pose:', err);
        if (isMountedRef.current) {
          setError(err instanceof Error ? err.message : 'Erro desconhecido ao inicializar detector');
          setIsLoading(false);
        }
      }
    }

    initializeDetector();

    // Cleanup ao desmontar
    return () => {
      isMountedRef.current = false;
      if (detectorRef.current) {
        try {
          if (detectorRef.current.dispose) {
            detectorRef.current.dispose();
          }
        } catch (err) {
          console.error('Erro ao fazer cleanup do detector:', err);
        }
        detectorRef.current = null;
      }
      setDetector(null);
    };
  }, []); // Apenas executa uma vez ao montar

  return { detector, isLoading, error };
}
