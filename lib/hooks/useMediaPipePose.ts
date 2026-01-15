'use client';

/**
 * Hook placeholder - MediaPipe Pose removido para melhor performance
 * 
 * A abordagem híbrida (posicionamento manual) foi adotada porque:
 * - TensorFlow.js + BlazePose são muito pesados (~20MB)
 * - Performance ruim em dispositivos móveis
 * - Tracking de pés impreciso com BlazePose (otimizado para corpo inteiro)
 * 
 * O ArTryOn agora usa posicionamento manual via gestos touch.
 */

interface UseMediaPipePoseReturn {
  detector: null;
  isLoading: false;
  error: null;
}

export function useMediaPipePose(): UseMediaPipePoseReturn {
  // Hook desabilitado - usando abordagem híbrida
  return {
    detector: null,
    isLoading: false,
    error: null,
  };
}
