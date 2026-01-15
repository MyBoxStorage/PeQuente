'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useCartStore } from '@/store/cartStore';
import { getStoreInfo } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { ArTryOnProps } from '@/types';


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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || '40');
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || 'preto');
  const [cameraReady, setCameraReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelsRef = useRef<THREE.Group[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const { toast: showToast } = useToast();
  const storeInfo = getStoreInfo();

  const useDualModels = Boolean(modelUrlLeft && modelUrlRight);

  // Analytics
  useEffect(() => {
    if (isOpen && window.gtag) {
      window.gtag('event', 'try_on_open', {
        event_category: 'AR',
        event_label: productName,
        product_id: productId,
      });
    }
  }, [isOpen, productName, productId]);

  // Inicializar câmera e Three.js
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    let mounted = true;

    async function init() {
      try {
        setLoading(true);
        setError(null);

        // 1. Iniciar câmera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });

        if (!mounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;

        // 2. Configurar vídeo
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          await new Promise<void>(resolve => {
            videoRef.current!.onloadedmetadata = () => resolve();
          });
          setCameraReady(true);
        }

        // 3. Configurar Three.js
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 2;
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ 
          canvas: canvasRef.current!,
          alpha: true, 
          antialias: true 
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        rendererRef.current = renderer;

        // Iluminação
        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(2, 2, 2);
        scene.add(dirLight);

        // 4. Carregar modelos
        const loader = new GLTFLoader();

        const loadModel = (url: string, posX: number): Promise<THREE.Group> => {
          return new Promise((resolve, reject) => {
            loader.load(
              url,
              (gltf) => {
                const model = gltf.scene;
                // Escala e posição inicial (na parte inferior da tela)
                model.scale.setScalar(0.4);
                model.position.set(posX, -0.8, -1);
                model.rotation.set(0.3, 0, 0); // Leve inclinação para parecer no chão
                scene.add(model);
                modelsRef.current.push(model);
                resolve(model);
              },
              undefined,
              reject
            );
          });
        };

        if (useDualModels && modelUrlLeft && modelUrlRight) {
          await Promise.all([
            loadModel(modelUrlLeft, -0.4),  // Esquerdo
            loadModel(modelUrlRight, 0.4),  // Direito
          ]);
        } else if (modelUrl) {
          await loadModel(modelUrl, 0);
        }

        setLoading(false);

        // 5. Loop de animação
        const animate = () => {
          if (!mounted) return;
          animationRef.current = requestAnimationFrame(animate);
          renderer.render(scene, camera);
        };
        animate();

      } catch (err) {
        console.error('[AR] Erro:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Erro ao inicializar');
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      mounted = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      modelsRef.current = [];
    };
  }, [isOpen, modelUrl, modelUrlLeft, modelUrlRight, useDualModels]);

  // Gestos touch para controle manual
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    let isDragging = false;
    let lastTouch = { x: 0, y: 0 };
    let lastPinchDist = 0;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        isDragging = true;
        lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        lastPinchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!modelsRef.current.length) return;

      if (e.touches.length === 1 && isDragging) {
        // Arrastar - move os modelos
        const dx = (e.touches[0].clientX - lastTouch.x) * 0.005;
        const dy = (e.touches[0].clientY - lastTouch.y) * 0.005;
        
        modelsRef.current.forEach(model => {
          model.position.x += dx;
          model.position.y -= dy;
        });
        
        lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        // Pinça - zoom
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const scale = dist / lastPinchDist;
        
        modelsRef.current.forEach(model => {
          model.scale.multiplyScalar(scale);
        });
        
        lastPinchDist = dist;
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    // Gestos de mouse para desktop
    let isMouseDown = false;
    let lastMouse = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      lastMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown || !modelsRef.current.length) return;
      
      const dx = (e.clientX - lastMouse.x) * 0.005;
      const dy = (e.clientY - lastMouse.y) * 0.005;
      
      modelsRef.current.forEach(model => {
        model.position.x += dx;
        model.position.y -= dy;
      });
      
      lastMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!modelsRef.current.length) return;
      
      const scale = e.deltaY > 0 ? 0.95 : 1.05;
      modelsRef.current.forEach(model => {
        model.scale.multiplyScalar(scale);
      });
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, [isOpen]);

  // Rotacionar com dois dedos ou botões
  const rotateModels = useCallback((direction: 'left' | 'right') => {
    const angle = direction === 'left' ? 0.2 : -0.2;
    modelsRef.current.forEach(model => {
      model.rotation.y += angle;
    });
  }, []);

  // Resetar posição
  const resetPosition = useCallback(() => {
    modelsRef.current.forEach((model, i) => {
      const posX = modelsRef.current.length === 2 ? (i === 0 ? -0.4 : 0.4) : 0;
      model.position.set(posX, -0.8, -1);
      model.scale.setScalar(0.4);
      model.rotation.set(0.3, 0, 0);
    });
  }, []);

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
      description: `${productName} tamanho ${selectedSize}`,
      variant: 'success',
    });
  }, [addItem, productId, productName, productSlug, productPrice, productImage, productBrand, selectedSize, showToast]);

  const handleWhatsApp = useCallback(() => {
    const phone = storeInfo.phone?.replace(/\D/g, '') || '';
    const msg = `Gostei do ${productName} tamanho ${selectedSize} após provar virtualmente!`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  }, [storeInfo.phone, productName, selectedSize]);

  const handleClose = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    onClose();
  }, [onClose]);

  // ESC para fechar
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && handleClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black" role="dialog" aria-label="Provador Virtual">
      {/* Vídeo da câmera como background */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Canvas Three.js sobreposto */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Container para ref */}
      <div ref={containerRef} className="absolute inset-0 pointer-events-none" />

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4" />
            <p>Carregando...</p>
          </div>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-500/90 text-white p-3 rounded-lg z-20">
          {error}
        </div>
      )}

      {/* Instruções */}
      {cameraReady && !loading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm z-10">
          👆 Arraste para mover • 🤏 Pinça para zoom
        </div>
      )}

      {/* Controles de rotação */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
        <button
          onClick={() => rotateModels('left')}
          className="w-12 h-12 bg-white/20 backdrop-blur rounded-full text-white text-2xl active:bg-white/40"
          aria-label="Girar para esquerda"
        >
          ↺
        </button>
        <button
          onClick={() => rotateModels('right')}
          className="w-12 h-12 bg-white/20 backdrop-blur rounded-full text-white text-2xl active:bg-white/40"
          aria-label="Girar para direita"
        >
          ↻
        </button>
        <button
          onClick={resetPosition}
          className="w-12 h-12 bg-white/20 backdrop-blur rounded-full text-white text-lg active:bg-white/40"
          aria-label="Resetar posição"
        >
          ⟲
        </button>
      </div>

      {/* Barra inferior */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 z-10">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {sizes.length > 0 && (
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="bg-white/20 text-white px-3 py-2 rounded-lg backdrop-blur"
            >
              {sizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
          
          <button
            onClick={handleAddToCart}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            🛒 Carrinho
          </button>
          
          <button
            onClick={handleWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            💬 WhatsApp
          </button>
          
          <button
            onClick={handleClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            ✕ Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
