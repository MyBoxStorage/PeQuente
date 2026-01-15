'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ShoppingCart, MessageCircle, RotateCcw, Camera, Box, Video, VideoOff } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { getStoreInfo } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface ModelViewerARProps {
  isOpen: boolean;
  onClose: () => void;
  modelUrl: string;
  productName: string;
  productId: string;
  productPrice: number;
  productSlug: string;
  productImage: string;
  productBrand: string;
  sizes?: string[];
}

export default function ModelViewerAR({
  isOpen,
  onClose,
  modelUrl,
  productName,
  productId,
  productPrice,
  productSlug,
  productImage,
  productBrand,
  sizes = [],
}: ModelViewerARProps) {
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || '40');
  const [loading, setLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [modelPosition, setModelPosition] = useState({ x: 0, y: 0 });
  const [modelScale, setModelScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Estados para pinça
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);
  const [initialScale, setInitialScale] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const addItem = useCartStore((state) => state.addItem);
  const { toast: showToast } = useToast();
  const storeInfo = getStoreInfo();

  // Carregar script do model-viewer
  useEffect(() => {
    if (!isOpen) return;

    const existingScript = document.querySelector('script[src*="model-viewer"]');
    if (existingScript) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js';
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, [isOpen]);

  // Criar model-viewer
  useEffect(() => {
    if (!isOpen || !scriptLoaded || !containerRef.current || !modelUrl) return;

    containerRef.current.innerHTML = '';

    const modelViewer = document.createElement('model-viewer');
    modelViewer.setAttribute('src', modelUrl);
    modelViewer.setAttribute('alt', `Modelo 3D do ${productName}`);
    
    // DESABILITAR AR NATIVO COMPLETAMENTE
    modelViewer.removeAttribute('ar');
    modelViewer.removeAttribute('ar-modes');
    modelViewer.removeAttribute('ar-scale');
    modelViewer.removeAttribute('ar-placement');
    
    // ROTAÇÃO FLUIDA - Sem auto-rotate para não andar sozinho
    modelViewer.setAttribute('camera-controls', '');
    modelViewer.setAttribute('touch-action', 'none');
    modelViewer.setAttribute('orbit-sensitivity', '1');
    modelViewer.setAttribute('interpolation-decay', '200'); // Mais suave
    modelViewer.setAttribute('interaction-prompt', 'none');
    
    // Câmera inicial - vista frontal
    modelViewer.setAttribute('camera-orbit', '0deg 75deg 105%');
    modelViewer.setAttribute('camera-target', 'auto auto auto');
    modelViewer.setAttribute('field-of-view', '45deg');
    
    // Iluminação
    modelViewer.setAttribute('shadow-intensity', '1');
    modelViewer.setAttribute('shadow-softness', '0.8');
    modelViewer.setAttribute('exposure', '1');
    modelViewer.setAttribute('environment-image', 'neutral');
    
    modelViewer.setAttribute('loading', 'eager');
    modelViewer.setAttribute('reveal', 'auto');
    
    // Estilos - fundo transparente quando câmera ativa
    modelViewer.style.width = '100%';
    modelViewer.style.height = '100%';
    modelViewer.style.backgroundColor = cameraMode ? 'transparent' : '#0a0a0a';
    modelViewer.style.setProperty('--poster-color', 'transparent');
    modelViewer.style.setProperty('--progress-bar-color', '#ef4444');

    modelViewer.addEventListener('load', () => setLoading(false));
    modelViewer.addEventListener('error', () => setLoading(false));

    containerRef.current.appendChild(modelViewer);

    // Analytics
    if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'view_3d_model', {
        event_category: '3D',
        event_label: productName,
        product_id: productId,
      });
    }
  }, [isOpen, scriptLoaded, modelUrl, productName, productId, cameraMode]);

  // Ativar/desativar câmera
  const toggleCamera = async () => {
    if (cameraMode) {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      setCameraMode(false);
      setCameraError(null);
      // Reset posição ao desativar câmera
      setModelPosition({ x: 0, y: 0 });
      setModelScale(1);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
        setCameraStream(stream);
        setCameraMode(true);
        setCameraError(null);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        showToast({
          title: '📷 Câmera ativada!',
          description: 'Arraste o tênis para posicionar',
          variant: 'success',
        });
      } catch (error) {
        console.error('Erro ao acessar câmera:', error);
        setCameraError('Não foi possível acessar a câmera');
        showToast({
          title: '❌ Erro na câmera',
          description: 'Permita o acesso à câmera nas configurações',
          variant: 'destructive',
        });
      }
    }
  };

  // Conectar stream ao video
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  // Cleanup câmera ao fechar
  useEffect(() => {
    if (!isOpen && cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setCameraMode(false);
    }
  }, [isOpen, cameraStream]);

  // Calcular distância entre dois toques
  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  // Touch Start
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!cameraMode) return;
    
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - modelPosition.x,
        y: e.touches[0].clientY - modelPosition.y
      });
    } else if (e.touches.length === 2) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      setInitialPinchDistance(distance);
      setInitialScale(modelScale);
      setIsDragging(false);
    }
  };

  // Touch Move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!cameraMode) return;
    
    if (e.touches.length === 1 && isDragging) {
      // Arrastar
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;
      setModelPosition({ x: newX, y: newY });
      
    } else if (e.touches.length === 2 && initialPinchDistance !== null) {
      // Pinça - escala relativa
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scaleFactor = currentDistance / initialPinchDistance;
      const newScale = Math.max(0.2, Math.min(5, initialScale * scaleFactor));
      setModelScale(newScale);
    }
  };

  // Touch End
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setIsDragging(false);
      setInitialPinchDistance(null);
    } else if (e.touches.length === 1) {
      setInitialPinchDistance(null);
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - modelPosition.x,
        y: e.touches[0].clientY - modelPosition.y
      });
    }
  };

  // Reset posição
  const resetPosition = () => {
    setModelPosition({ x: 0, y: 0 });
    setModelScale(1);
  };

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
    const msg = `Olá! Gostei do ${productName} tamanho ${selectedSize} que vi em 3D!`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  }, [storeInfo.phone, productName, selectedSize]);

  // ESC para fechar
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden" role="dialog" aria-label="Visualizador 3D">
      {/* Vídeo da câmera (fundo) */}
      {cameraMode && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Box className="w-6 h-6 text-red-500" />
            <div>
              <h2 className="text-white font-bold text-lg truncate max-w-[180px] sm:max-w-none">
                {productName}
              </h2>
              <p className="text-gray-400 text-sm">{productBrand}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleCamera}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                cameraMode 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              aria-label={cameraMode ? 'Desativar câmera' : 'Ativar câmera'}
            >
              {cameraMode ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Model Viewer Container - overflow visible para não cortar */}
      <div 
        className="absolute inset-0 pt-16 pb-44 overflow-visible"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {modelUrl ? (
          <>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4" />
                  <p className="text-lg font-medium">Carregando modelo 3D...</p>
                </div>
              </div>
            )}
            
            {/* Container com transform - SEM conflito de animações */}
            <div 
              className="w-full h-full overflow-visible"
              style={cameraMode ? {
                transform: `translate(${modelPosition.x}px, ${modelPosition.y}px) scale(${modelScale})`,
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                transformOrigin: 'center center',
                willChange: 'transform'
              } : undefined}
            >
              <div 
                ref={containerRef} 
                className="w-full h-full overflow-visible"
                style={{ backgroundColor: cameraMode ? 'transparent' : '#0a0a0a' }}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <div className="text-center">
              <Box className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <p className="text-xl">Modelo 3D não disponível</p>
            </div>
          </div>
        )}
      </div>

      {/* Erro da câmera */}
      {cameraError && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-red-600/90 backdrop-blur text-white px-4 py-2 rounded-lg text-sm z-30">
          {cameraError}
        </div>
      )}

      {/* Instruções */}
      <div className="absolute bottom-44 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-sm">
        <div className="bg-black/70 backdrop-blur-lg rounded-lg px-4 py-3 text-center">
          {cameraMode ? (
            <>
              <p className="text-white text-sm mb-2">
                <Camera className="w-4 h-4 inline mr-2" />
                Câmera ativada!
              </p>
              <p className="text-gray-300 text-xs">
                👆 Arraste para mover • 🤏 Pinça para zoom
              </p>
              <button
                onClick={resetPosition}
                className="mt-2 text-red-400 text-xs underline"
              >
                Resetar posição
              </button>
            </>
          ) : (
            <>
              <p className="text-white text-sm mb-1">
                <RotateCcw className="w-4 h-4 inline mr-2" />
                Arraste para girar • Pinça para zoom
              </p>
              <p className="text-green-400 text-xs">
                📷 Clique no ícone da câmera para ver no seu ambiente
              </p>
            </>
          )}
        </div>
      </div>

      {/* Barra inferior */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent z-20">
        <div className="max-w-4xl mx-auto p-4 space-y-3">
          {sizes.length > 0 && (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-gray-400 text-sm">Tamanho:</span>
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[44px] h-10 px-3 rounded-lg font-medium transition ${
                    selectedSize === size
                      ? 'bg-red-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <div className="text-white">
              <p className="text-2xl font-bold text-red-500">
                R$ {productPrice.toFixed(2).replace('.', ',')}
              </p>
              <p className="text-xs text-gray-400">
                ou 12x de R$ {(productPrice / 12).toFixed(2).replace('.', ',')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleWhatsApp}
                className="h-12 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center gap-2"
                aria-label="Contato via WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="h-12 px-6 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Comprar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
