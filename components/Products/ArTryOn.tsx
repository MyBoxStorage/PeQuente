'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useCartStore } from '@/store/cartStore';
import { getStoreInfo } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { ArTryOnProps } from '@/types';
import { useMediaPipePose } from '@/lib/hooks/useMediaPipePose';

// Declaração de tipos globais para window.gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function ArTryOn({
  isOpen,
  onClose,
  modelUrl,
  modelUrlLeft,
  modelUrlRight,
  productName,
  productId,
  productPrice,
  productSlug,
  productImage,
  productBrand,
  sizes = [],
  colors = [],
}: ArTryOnProps) {
  const [arSupported, setArSupported] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || '40');
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || 'preto');

  // MediaPipe Pose Detection
  const { detector, isLoading: detectorLoading, error: detectorError } = useMediaPipePose();
  const [footTracking, setFootTracking] = useState<{
    leftFoot: { x: number; y: number; angle: number; size: number; confidence: number } | null;
    rightFoot: { x: number; y: number; angle: number; size: number; confidence: number } | null;
  }>({ leftFoot: null, rightFoot: null });
  const [trackingStatus, setTrackingStatus] = useState<'initializing' | 'tracking' | 'no_feet' | 'error'>('initializing');
  const detectionFrameRef = useRef<number | null>(null);
  
  // Ref para footTracking (para evitar closure no loop animate)
  const footTrackingRef = useRef<{
    leftFoot: { x: number; y: number; angle: number; size: number; confidence: number } | null;
    rightFoot: { x: number; y: number; angle: number; size: number; confidence: number } | null;
  }>({ leftFoot: null, rightFoot: null });

  const sceneRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef3D = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelsRef = useRef<THREE.Group[]>([]); // Array para armazenar ambos os modelos
  const leftShoeRef = useRef<THREE.Group | null>(null); // Ref para modelo do pé esquerdo
  const rightShoeRef = useRef<THREE.Group | null>(null); // Ref para modelo do pé direito
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const { toast: showToast } = useToast();
  const storeInfo = getStoreInfo();

  // Determinar se estamos usando modelos separados (left/right) ou modelo único
  const useDualModels = Boolean(modelUrlLeft && modelUrlRight);

  // Função de conversão de coordenadas 2D para 3D
  const convertScreenToWorld = useCallback((
    screenX: number,
    screenY: number,
    videoWidth: number,
    videoHeight: number,
    camera: THREE.PerspectiveCamera,
    distanceZ: number = -2
  ) => {
    // Normalizar coordenadas para NDC (Normalized Device Coordinates: -1 a 1)
    const ndcX = (screenX / videoWidth) * 2 - 1;
    const ndcY = -(screenY / videoHeight) * 2 + 1; // Y invertido

    // Calcular tamanho do plano visível na distância Z
    const vFOV = (camera.fov * Math.PI) / 180; // Converter para radianos
    const height = 2 * Math.tan(vFOV / 2) * Math.abs(distanceZ);
    const width = height * camera.aspect;

    // Converter NDC para coordenadas mundo
    const worldX = ndcX * (width / 2);
    const worldY = ndcY * (height / 2);

    return { x: worldX, y: worldY, z: distanceZ };
  }, []);

  // Analytics - Evento quando modal abre
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'try_on_open', {
        event_category: 'AR',
        event_label: productName,
        product_id: productId,
      });
    }
  }, [isOpen, productName, productId]);

  // Analytics - Evento quando modal fecha
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'try_on_close', {
          event_category: 'AR',
          event_label: productName,
          product_id: productId,
        });
      }
    };
  }, [productName, productId]);

  // Atualizar ref quando footTracking mudar
  useEffect(() => {
    footTrackingRef.current = footTracking;
  }, [footTracking]);

  // Verificar suporte e permissão de câmera
  useEffect(() => {
    if (!isOpen) return;

    async function checkSupport() {
      try {
        // Verificar suporte de câmera
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setError('Seu navegador não suporta acesso à câmera');
          setLoading(false);
          return;
        }

        // Tentar obter permissão de câmera
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          });
          
          // Parar stream imediatamente (vamos iniciar novamente depois)
          stream.getTracks().forEach(track => track.stop());
          
          setCameraPermission(true);
          setArSupported(true); // Considerar suportado se câmera funcionar
        } catch (err) {
          setError('Permissão de câmera negada ou não disponível');
          setCameraPermission(false);
        }

        setLoading(false);
      } catch (err) {
        console.error('Erro ao verificar suporte AR:', err);
        setError('Erro ao verificar suporte AR');
        setLoading(false);
      }
    }

    checkSupport();
  }, [isOpen]);

  // Tentar bloquear orientação em landscape
  useEffect(() => {
    if (!isOpen) return;

    let locked = false;

    async function lockOrientation() {
      if ('orientation' in screen && 'lock' in screen.orientation) {
        try {
          await (screen.orientation as any).lock('landscape');
          locked = true;
          if (process.env.NODE_ENV === 'development') {
            console.log('[ArTryOn] Orientação bloqueada em landscape');
          }
        } catch (err) {
          // Orientação não pode ser bloqueada (não suportado ou já bloqueada)
          if (process.env.NODE_ENV === 'development') {
            console.log('[ArTryOn] Não foi possível bloquear orientação:', err);
          }
        }
      }
    }

    lockOrientation();

    return () => {
      if (locked && 'orientation' in screen && 'unlock' in screen.orientation) {
        (screen.orientation as any).unlock();
      }
    };
  }, [isOpen]);

  // Inicializar Three.js e câmera
  useEffect(() => {
    if (!isOpen || !sceneRef.current || !cameraPermission || !arSupported) return;

    const container = sceneRef.current;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let renderer: THREE.WebGLRenderer | null = null;
    let video: HTMLVideoElement | null = null;
    let stream: MediaStream | null = null;
    let handleResize: (() => void) | null = null;
    let handleTouchStart: ((e: TouchEvent) => void) | null = null;
    let handleTouchMove: ((e: TouchEvent) => void) | null = null;
    let handleTouchEnd: (() => void) | null = null;
    let handlePinchStart: ((e: TouchEvent) => void) | null = null;
    let handlePinchMove: ((e: TouchEvent) => void) | null = null;

    async function init() {
      try {
        // Obter stream de vídeo
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        streamRef.current = stream;

        video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.playsInline = true;
        video.setAttribute('playsinline', 'true');
        videoRef.current = video;

        await new Promise<void>((resolve) => {
          video!.onloadedmetadata = () => {
            video!.play();
            resolve();
          };
        });

        // Criar cena Three.js
        scene = new THREE.Scene();
        sceneRef3D.current = scene;

        // Criar câmera
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 5;
        cameraRef.current = camera;

        // Criar renderer
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Adicionar iluminação
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Carregar modelo(s) 3D
        const loader = new GLTFLoader();
        let modelsLoaded = 0;
        const expectedModels = useDualModels ? 2 : 1;

        const onModelLoaded = () => {
          modelsLoaded++;
          if (modelsLoaded === expectedModels) {
            setLoading(false);
          }
        };

        // Carregar modelos separados (pé esquerdo e direito)
        if (useDualModels && modelUrlLeft && modelUrlRight) {
          // Carregar pé esquerdo
          loader.load(
            modelUrlLeft,
            (gltf) => {
              if (scene) {
                const leftModel = gltf.scene.clone();
                leftModel.scale.setScalar(0.005); // Escala base
                // Posição inicial oculta (será atualizada pelo tracking)
                leftModel.position.set(0, 0, -2);
                leftModel.visible = false; // Começa invisível até detectar pé
                scene.add(leftModel);
                modelsRef.current.push(leftModel);
                leftShoeRef.current = leftModel;
                onModelLoaded();
              }
            },
            undefined,
            (err) => {
              console.error('Erro ao carregar pé esquerdo:', err);
              setError('Erro ao carregar modelo do pé esquerdo. Verifique se o arquivo existe.');
            }
          );

          // Carregar pé direito
          loader.load(
            modelUrlRight,
            (gltf) => {
              if (scene) {
                const rightModel = gltf.scene.clone();
                rightModel.scale.setScalar(0.005); // Escala base
                // Posição inicial oculta (será atualizada pelo tracking)
                rightModel.position.set(0, 0, -2);
                rightModel.visible = false; // Começa invisível até detectar pé
                scene.add(rightModel);
                modelsRef.current.push(rightModel);
                rightShoeRef.current = rightModel;
                onModelLoaded();
              }
            },
            undefined,
            (err) => {
              console.error('Erro ao carregar pé direito:', err);
              setError('Erro ao carregar modelo do pé direito. Verifique se o arquivo existe.');
            }
          );
        } else if (modelUrl) {
          // Carregar modelo único (modo de compatibilidade)
          loader.load(
            modelUrl,
            (gltf) => {
              if (scene && modelsRef.current.length === 0) {
                const model = gltf.scene;
                model.scale.set(0.1, 0.1, 0.1);
                model.position.set(0, -0.5, -1);
                scene.add(model);
                modelsRef.current.push(model);
                setLoading(false);
              }
            },
            undefined,
            (err) => {
              console.error('Erro ao carregar modelo 3D:', err);
              setError('Erro ao carregar modelo 3D. Verifique se o arquivo existe.');
              setLoading(false);
            }
          );
        } else {
          setError('Nenhum modelo 3D especificado.');
          setLoading(false);
        }

        // Touch controls
        let isDragging = false;
        let previousTouch: { x: number; y: number } | null = null;

        handleTouchStart = (e: TouchEvent) => {
          if (e.touches.length === 1) {
            isDragging = true;
            previousTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }
        };

        handleTouchMove = (e: TouchEvent) => {
          if (isDragging && previousTouch && modelsRef.current.length > 0 && e.touches.length === 1) {
            const deltaX = e.touches[0].clientX - previousTouch.x;
            const deltaY = e.touches[0].clientY - previousTouch.y;
            
            // Rotacionar todos os modelos juntos
            modelsRef.current.forEach((model) => {
              model.rotation.y += deltaX * 0.01;
              model.rotation.x -= deltaY * 0.01;
            });
            
            previousTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }
        };

        handleTouchEnd = () => {
          isDragging = false;
          previousTouch = null;
        };

        // Pinch zoom
        let initialDistance = 0;
        handlePinchStart = (e: TouchEvent) => {
          if (e.touches.length === 2 && modelsRef.current.length > 0) {
            initialDistance = Math.hypot(
              e.touches[0].clientX - e.touches[1].clientX,
              e.touches[0].clientY - e.touches[1].clientY
            );
          }
        };

        handlePinchMove = (e: TouchEvent) => {
          if (e.touches.length === 2 && modelsRef.current.length > 0 && initialDistance > 0) {
            const currentDistance = Math.hypot(
              e.touches[0].clientX - e.touches[1].clientX,
              e.touches[0].clientY - e.touches[1].clientY
            );
            const scale = currentDistance / initialDistance;
            const currentScale = modelsRef.current[0].scale.x / 0.1;
            
            // Aplicar zoom em todos os modelos
            modelsRef.current.forEach((model) => {
              model.scale.multiplyScalar(scale / currentScale);
            });
            initialDistance = currentDistance;
          }
        };

        if (renderer) {
          renderer.domElement.addEventListener('touchstart', handleTouchStart);
          renderer.domElement.addEventListener('touchmove', handleTouchMove);
          renderer.domElement.addEventListener('touchend', handleTouchEnd);
          renderer.domElement.addEventListener('touchstart', handlePinchStart);
          renderer.domElement.addEventListener('touchmove', handlePinchMove);
        }

        // Resize handler
        handleResize = () => {
          if (camera && renderer && container) {
            const width = container.clientWidth;
            const height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
          }
        };

        window.addEventListener('resize', handleResize);

        // Animation loop
        const animate = () => {
          if (scene && camera && renderer) {
            animationFrameRef.current = requestAnimationFrame(animate);
            
            // Atualizar posição dos modelos baseado no tracking
            if (footTrackingRef.current.leftFoot && leftShoeRef.current && camera) {
              const videoWidth = videoRef.current?.videoWidth || 1280;
              const videoHeight = videoRef.current?.videoHeight || 720;
              
              const worldPos = convertScreenToWorld(
                footTrackingRef.current.leftFoot.x,
                footTrackingRef.current.leftFoot.y,
                videoWidth,
                videoHeight,
                camera,
                -2 // Distância fixa da câmera (ajustar se necessário)
              );

              // Interpolar suavemente (lerp) para evitar tremores
              leftShoeRef.current.position.lerp(
                new THREE.Vector3(worldPos.x, worldPos.y, worldPos.z),
                0.3 // Fator de suavização (0.1 = suave, 1.0 = instantâneo)
              );

              // Rotação do modelo baseado no ângulo do pé
              leftShoeRef.current.rotation.z = THREE.MathUtils.lerp(
                leftShoeRef.current.rotation.z,
                footTrackingRef.current.leftFoot.angle,
                0.3
              );

              // Escala baseada no tamanho detectado do pé
              const baseScale = 0.005; // Ajustar este valor conforme necessário
              const targetScale = (footTrackingRef.current.leftFoot.size / 200) * baseScale;
              leftShoeRef.current.scale.setScalar(
                THREE.MathUtils.lerp(leftShoeRef.current.scale.x, targetScale, 0.2)
              );

              // Tornar visível quando detectado
              leftShoeRef.current.visible = true;
            } else if (leftShoeRef.current) {
              // Ocultar se não detectado
              leftShoeRef.current.visible = false;
            }

            // Repetir para pé direito
            if (footTrackingRef.current.rightFoot && rightShoeRef.current && camera) {
              const videoWidth = videoRef.current?.videoWidth || 1280;
              const videoHeight = videoRef.current?.videoHeight || 720;
              
              const worldPos = convertScreenToWorld(
                footTrackingRef.current.rightFoot.x,
                footTrackingRef.current.rightFoot.y,
                videoWidth,
                videoHeight,
                camera,
                -2
              );

              rightShoeRef.current.position.lerp(
                new THREE.Vector3(worldPos.x, worldPos.y, worldPos.z),
                0.3
              );

              rightShoeRef.current.rotation.z = THREE.MathUtils.lerp(
                rightShoeRef.current.rotation.z,
                footTrackingRef.current.rightFoot.angle,
                0.3
              );

              const baseScale = 0.005;
              const targetScale = (footTrackingRef.current.rightFoot.size / 200) * baseScale;
              rightShoeRef.current.scale.setScalar(
                THREE.MathUtils.lerp(rightShoeRef.current.scale.x, targetScale, 0.2)
              );

              rightShoeRef.current.visible = true;
            } else if (rightShoeRef.current) {
              rightShoeRef.current.visible = false;
            }

            renderer.render(scene, camera);
          }
        };
        animate();

        if (process.env.NODE_ENV === 'development') {
          console.log('[ArTryOn] AR inicializado com sucesso');
        }
      } catch (err) {
        console.error('Erro ao inicializar AR:', err);
        setError('Erro ao inicializar AR');
      }
    }

    init();

    // Cleanup
    return () => {
      if (handleResize) {
        window.removeEventListener('resize', handleResize);
      }
      if (renderer && handleTouchStart && handleTouchMove && handleTouchEnd && handlePinchStart && handlePinchMove) {
        renderer.domElement.removeEventListener('touchstart', handleTouchStart);
        renderer.domElement.removeEventListener('touchmove', handleTouchMove);
        renderer.domElement.removeEventListener('touchend', handleTouchEnd);
        renderer.domElement.removeEventListener('touchstart', handlePinchStart);
        renderer.domElement.removeEventListener('touchmove', handlePinchMove);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      if (renderer && container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      if (renderer) {
        renderer.dispose();
      }
      
      // Limpar modelos
      modelsRef.current = [];
      rendererRef.current = null;
      sceneRef3D.current = null;
      cameraRef.current = null;
    };
  }, [isOpen, cameraPermission, arSupported, modelUrlLeft, modelUrlRight, modelUrl]);

  // Cleanup ao fechar
  useEffect(() => {
    if (!isOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  }, [isOpen]);

  // Handlers
  const handleAddToCart = useCallback(() => {
    addItem({
      productId,
      name: productName,
      slug: productSlug,
      price: productPrice,
      image: productImage,
      brand: productBrand,
      size: selectedSize,
    });

    showToast({
      title: 'Adicionado ao carrinho!',
      description: `${productName} tamanho ${selectedSize} foi adicionado. Venha retirar na loja!`,
      variant: 'success',
    });
  }, [addItem, productId, productName, productSlug, productPrice, productImage, productBrand, selectedSize, showToast]);

  const handleWhatsApp = useCallback(() => {
    const phoneNumber = storeInfo.phone?.replace(/\D/g, '') || '';
    const message = `Gostei do ${productName} tamanho ${selectedSize} cor ${selectedColor} após provar virtualmente!`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }, [storeInfo.phone, productName, selectedSize, selectedColor]);

  const handleClose = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    onClose();
  }, [onClose]);

  // Função de detecção de pose
  const detectPose = useCallback(async () => {
    if (!detector || !videoRef.current || !videoRef.current.readyState) return;

    try {
      const poses = await detector.estimatePoses(videoRef.current, {
        flipHorizontal: false,
      });

      if (poses && poses.length > 0) {
        const pose = poses[0];
        const keypoints = pose.keypoints;

        // Função auxiliar para encontrar keypoint
        const findKeypoint = (name: string) => 
          keypoints.find((kp: any) => kp.name === name);

        // Pé esquerdo
        const leftAnkle = findKeypoint('left_ankle');
        const leftHeel = findKeypoint('left_heel');
        const leftFootIndex = findKeypoint('left_foot_index');

        // Pé direito
        const rightAnkle = findKeypoint('right_ankle');
        const rightHeel = findKeypoint('right_heel');
        const rightFootIndex = findKeypoint('right_foot_index');

        const CONFIDENCE_THRESHOLD = 0.3;
        let leftFootData = null;
        let rightFootData = null;

        // Processar pé esquerdo
        if (leftAnkle && leftHeel && leftFootIndex && 
            leftAnkle.score > CONFIDENCE_THRESHOLD &&
            leftHeel.score > CONFIDENCE_THRESHOLD &&
            leftFootIndex.score > CONFIDENCE_THRESHOLD) {
          
          const centerX = (leftAnkle.x + leftHeel.x + leftFootIndex.x) / 3;
          const centerY = (leftAnkle.y + leftHeel.y + leftFootIndex.y) / 3;
          const angle = Math.atan2(leftFootIndex.y - leftHeel.y, leftFootIndex.x - leftHeel.x);
          const size = Math.sqrt(
            Math.pow(leftFootIndex.x - leftHeel.x, 2) + 
            Math.pow(leftFootIndex.y - leftHeel.y, 2)
          );
          const confidence = (leftAnkle.score + leftHeel.score + leftFootIndex.score) / 3;

          leftFootData = { x: centerX, y: centerY, angle, size, confidence };
        }

        // Processar pé direito
        if (rightAnkle && rightHeel && rightFootIndex && 
            rightAnkle.score > CONFIDENCE_THRESHOLD &&
            rightHeel.score > CONFIDENCE_THRESHOLD &&
            rightFootIndex.score > CONFIDENCE_THRESHOLD) {
          
          const centerX = (rightAnkle.x + rightHeel.x + rightFootIndex.x) / 3;
          const centerY = (rightAnkle.y + rightHeel.y + rightFootIndex.y) / 3;
          const angle = Math.atan2(rightFootIndex.y - rightHeel.y, rightFootIndex.x - rightHeel.x);
          const size = Math.sqrt(
            Math.pow(rightFootIndex.x - rightHeel.x, 2) + 
            Math.pow(rightFootIndex.y - rightHeel.y, 2)
          );
          const confidence = (rightAnkle.score + rightHeel.score + rightFootIndex.score) / 3;

          rightFootData = { x: centerX, y: centerY, angle, size, confidence };
        }

        setFootTracking({ leftFoot: leftFootData, rightFoot: rightFootData });
        
        if (leftFootData || rightFootData) {
          setTrackingStatus('tracking');
        } else {
          setTrackingStatus('no_feet');
        }
      } else {
        setTrackingStatus('no_feet');
        setFootTracking({ leftFoot: null, rightFoot: null });
      }
    } catch (err) {
      console.error('Erro na detecção de pose:', err);
      setTrackingStatus('error');
    }

    // Continuar loop a 30 FPS (aproximadamente)
    detectionFrameRef.current = requestAnimationFrame(() => {
      setTimeout(detectPose, 33); // ~30 FPS
    });
  }, [detector]);

  // Keyboard handler (ESC para fechar)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Iniciar detecção de pose
  useEffect(() => {
    if (detector && videoRef.current && isOpen) {
      detectPose();
    }

    return () => {
      if (detectionFrameRef.current) {
        cancelAnimationFrame(detectionFrameRef.current);
        detectionFrameRef.current = null;
      }
    };
  }, [detector, detectPose, isOpen]);

  if (!isOpen) return null;

  // Fallback - Sem permissão de câmera
  if (!cameraPermission) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a] p-4"
        role="dialog"
        aria-label="Try-On Virtual AR"
      >
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Câmera Necessária
          </h2>
          <p className="text-gray-400 mb-6">
            Para usar o Try-On Virtual, precisamos de acesso à sua câmera.
            Por favor, permita o acesso à câmera nas configurações do navegador.
          </p>
          {productImage && (
            <img
              src={productImage}
              alt={productName}
              className="w-full rounded-lg mb-6"
            />
          )}
          <button
            onClick={handleClose}
            className="bg-[#00008B] hover:bg-[#000070] text-white px-6 py-3 rounded-lg transition"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  // Fallback - Sem suporte AR (usar model-viewer)
  if (!arSupported) {
    const fallbackModelUrl = modelUrl || modelUrlLeft || '/models/ultraboost.glb';
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0a]"
        role="dialog"
        aria-label="Try-On Virtual AR"
      >
        <div className="flex-1 flex items-center justify-center p-4">
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore - model-viewer não tem tipos TypeScript oficiais */}
          <model-viewer
            src={fallbackModelUrl}
            alt={productName}
            camera-controls
            auto-rotate
            ar
            shadow-intensity="1"
            style={{ width: '100%', height: '80%' }}
          />
        </div>
        <div className="bg-[#252525] p-4 flex flex-wrap gap-4 justify-around">
          {(sizes.length > 0 || colors.length > 0) && (
            <div className="flex gap-4">
              {sizes.length > 0 && (
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="bg-[#1a1a1a] text-white p-2 rounded border border-[#353535]"
                  aria-label="Selecionar tamanho"
                >
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              )}
              {colors.length > 0 && (
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="bg-[#1a1a1a] text-white p-2 rounded border border-[#353535]"
                  aria-label="Selecionar cor"
                >
                  {colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-[#FF0000] hover:bg-[#E00000] text-white px-6 py-2 rounded transition"
              aria-label="Adicionar ao carrinho"
            >
              Adicionar ao Carrinho
            </button>
            <button
              onClick={handleWhatsApp}
              className="bg-[#FF0000] hover:bg-[#E00000] text-white px-6 py-2 rounded transition"
              aria-label="Falar no WhatsApp"
            >
              WhatsApp
            </button>
            <button
              onClick={handleClose}
              className="bg-[#00008B] hover:bg-[#000070] text-white px-6 py-2 rounded transition"
              aria-label="Fechar"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // UI Principal - Com AR
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0a]"
      role="dialog"
      aria-label="Try-On Virtual AR"
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0000] mx-auto mb-4"></div>
            <p>Carregando AR...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-500/20 border border-red-500 text-red-400 p-4 rounded z-10">
          {error}
        </div>
      )}

      <div ref={sceneRef} className="flex-1 relative">
        {/* Status de tracking */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm z-50">
          {detectorLoading && '🔄 Carregando detector...'}
          {detectorError && `❌ Erro: ${detectorError}`}
          {trackingStatus === 'tracking' && '✅ Pés detectados'}
          {trackingStatus === 'no_feet' && '👣 Aponte para seus pés'}
          {trackingStatus === 'initializing' && '⏳ Inicializando...'}
        </div>

        {/* Debug info (opcional) */}
        {footTracking.leftFoot && (
          <div className="absolute bottom-20 left-4 bg-blue-500/70 rounded px-2 py-1 text-white text-xs">
            L: {footTracking.leftFoot.confidence.toFixed(2)}
          </div>
        )}
        {footTracking.rightFoot && (
          <div className="absolute bottom-20 right-4 bg-red-500/70 rounded px-2 py-1 text-white text-xs">
            R: {footTracking.rightFoot.confidence.toFixed(2)}
          </div>
        )}
      </div>

      <div className="bg-[#252525] p-4 flex flex-wrap gap-4 justify-around">
        {(sizes.length > 0 || colors.length > 0) && (
          <div className="flex gap-4">
            {sizes.length > 0 && (
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="bg-[#1a1a1a] text-white p-2 rounded border border-[#353535]"
                aria-label="Selecionar tamanho"
              >
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            )}
            {colors.length > 0 && (
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="bg-[#1a1a1a] text-white p-2 rounded border border-[#353535]"
                aria-label="Selecionar cor"
              >
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
        <div className="flex gap-4">
          <button
            onClick={handleAddToCart}
            className="bg-[#FF0000] hover:bg-[#E00000] text-white px-6 py-2 rounded transition"
            aria-label="Adicionar ao carrinho"
          >
            Adicionar ao Carrinho
          </button>
          <button
            onClick={handleWhatsApp}
            className="bg-[#FF0000] hover:bg-[#E00000] text-white px-6 py-2 rounded transition"
            aria-label="Falar no WhatsApp"
          >
            WhatsApp
          </button>
          <button
            onClick={handleClose}
            className="bg-[#00008B] hover:bg-[#000070] text-white px-6 py-2 rounded transition"
            aria-label="Fechar"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
