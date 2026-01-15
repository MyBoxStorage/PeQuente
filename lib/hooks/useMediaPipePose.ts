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
// TensorFlow.js é necessário como base para pose-detection
const CDN_URLS = {
  // TensorFlow.js core (necessário)
  tfjs: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.17.0/dist/tf.min.js',
  // MediaPipe Pose
  mediapipePose: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose.js',
  // Pose Detection API
  poseDetection: 'https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.0/dist/pose-detection.min.js',
};

// MediaPipe solution path do CDN
const MEDIAPIPE_SOLUTION_PATH = 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404';

/**
 * Carrega um script dinamicamente com retry
 */
function loadScript(src: string, retries = 3): Promise<void> {
  return new Promise((resolve, reject) => {
    // Verificar se o script já foi carregado
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      resolve();
      return;
    }

    const attemptLoad = (attemptsLeft: number) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      
      script.onload = () => {
        console.log(`[MediaPipe] Script carregado: ${src}`);
        resolve();
      };
      
      script.onerror = () => {
        if (attemptsLeft > 0) {
          console.warn(`[MediaPipe] Erro ao carregar script, tentando novamente (${attemptsLeft} tentativas restantes): ${src}`);
          setTimeout(() => attemptLoad(attemptsLeft - 1), 500);
        } else {
          reject(new Error(`Erro ao carregar script após ${retries} tentativas: ${src}`));
        }
      };
      
      document.head.appendChild(script);
    };

    attemptLoad(retries);
  });
}

/**
 * Aguarda até que uma variável global esteja disponível
 */
function waitForGlobal(name: string, timeout = 20000): Promise<void> {
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
        reject(new Error(`Timeout aguardando ${name} (${timeout}ms)`));
      }
    }, 100);
  });
}

/**
 * Tenta obter a API poseDetection de diferentes formas
 */
function getPoseDetectionAPI(): any {
  const win = window as any;
  
  // Log para debug
  console.log('[MediaPipe] Procurando poseDetection API...');
  console.log('[MediaPipe] window.poseDetection:', typeof win.poseDetection);
  
  // Tentar diferentes formas de acesso
  if (win.poseDetection && typeof win.poseDetection.createDetector === 'function') {
    console.log('[MediaPipe] Encontrado em window.poseDetection');
    return win.poseDetection;
  }
  
  // Tentar poseDetection.poseDetection (alguns builds UMD fazem isso)
  if (win.poseDetection?.poseDetection && typeof win.poseDetection.poseDetection.createDetector === 'function') {
    console.log('[MediaPipe] Encontrado em window.poseDetection.poseDetection');
    return win.poseDetection.poseDetection;
  }
  
  // Tentar window.tf?.poseDetection
  if (win.tf?.poseDetection && typeof win.tf.poseDetection.createDetector === 'function') {
    console.log('[MediaPipe] Encontrado em window.tf.poseDetection');
    return win.tf.poseDetection;
  }
  
  // Log disponível para debug
  if (win.poseDetection) {
    console.log('[MediaPipe] poseDetection existe mas createDetector não é função');
    console.log('[MediaPipe] Tipo de poseDetection:', typeof win.poseDetection);
    console.log('[MediaPipe] Keys:', Object.keys(win.poseDetection));
  }
  
  return null;
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
        
        console.log('[MediaPipe] Iniciando carregamento das bibliotecas...');

        // 1. Carregar TensorFlow.js primeiro (dependência necessária)
        console.log('[MediaPipe] Carregando TensorFlow.js...');
        await loadScript(CDN_URLS.tfjs);
        await waitForGlobal('tf', 15000);
        console.log('[MediaPipe] TensorFlow.js carregado!');
        
        // Aguardar inicialização do TF
        await new Promise(resolve => setTimeout(resolve, 300));

        // 2. Carregar MediaPipe Pose
        console.log('[MediaPipe] Carregando MediaPipe Pose...');
        await loadScript(CDN_URLS.mediapipePose);
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log('[MediaPipe] MediaPipe Pose carregado!');

        // 3. Carregar Pose Detection API
        console.log('[MediaPipe] Carregando Pose Detection API...');
        await loadScript(CDN_URLS.poseDetection);
        
        // Aguardar inicialização com múltiplas tentativas
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!isMountedRef.current) return;
        
        // Tentar obter a API várias vezes
        let poseDetection = null;
        for (let attempt = 0; attempt < 15; attempt++) {
          poseDetection = getPoseDetectionAPI();
          if (poseDetection && typeof poseDetection.createDetector === 'function') {
            console.log(`[MediaPipe] API encontrada na tentativa ${attempt + 1}`);
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        if (!isMountedRef.current) return;

        if (!poseDetection) {
          // Mostrar o que está disponível para debug
          const win = window as any;
          console.error('[MediaPipe] Estado do window:', {
            tf: typeof win.tf,
            poseDetection: typeof win.poseDetection,
            Pose: typeof win.Pose,
          });
          throw new Error('Biblioteca pose-detection não carregou corretamente. Verifique a conexão.');
        }

        if (typeof poseDetection.createDetector !== 'function') {
          console.error('[MediaPipe] createDetector não é função:', typeof poseDetection.createDetector);
          console.error('[MediaPipe] Propriedades disponíveis:', Object.keys(poseDetection));
          throw new Error('createDetector não disponível na biblioteca carregada');
        }

        // Verificar modelo BlazePose
        const model = poseDetection.SupportedModels?.BlazePose;
        if (!model) {
          console.error('[MediaPipe] SupportedModels:', poseDetection.SupportedModels);
          throw new Error('BlazePose não está disponível');
        }

        console.log('[MediaPipe] Criando detector BlazePose...');
        
        const detectorConfig = {
          runtime: 'mediapipe' as const,
          modelType: 'lite' as const,
          solutionPath: MEDIAPIPE_SOLUTION_PATH,
          enableSmoothing: true,
        };

        const createdDetector = await poseDetection.createDetector(model, detectorConfig);

        if (!isMountedRef.current) {
          if (createdDetector && createdDetector.dispose) {
            createdDetector.dispose();
          }
          return;
        }

        console.log('[MediaPipe] Detector criado com sucesso!');
        detectorRef.current = createdDetector;
        setDetector(createdDetector);
        setIsLoading(false);
      } catch (err) {
        console.error('[MediaPipe] Erro ao inicializar:', err);
        if (isMountedRef.current) {
          const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
          setError(errorMessage);
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
          console.error('[MediaPipe] Erro ao fazer cleanup do detector:', err);
        }
        detectorRef.current = null;
      }
      setDetector(null);
    };
  }, []);

  return { detector, isLoading, error };
}
