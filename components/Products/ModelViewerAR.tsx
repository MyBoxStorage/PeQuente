'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ShoppingCart, MessageCircle, RotateCcw, Smartphone, Box, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { getStoreInfo } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface ModelViewerARProps {
  isOpen: boolean;
  onClose: () => void;
  modelUrlLeft?: string;
  modelUrlRight?: string;
  productName: string;
  productId: string;
  productPrice: number;
  productSlug: string;
  productImage: string;
  productBrand: string;
  sizes?: string[];
  colors?: string[];
}

export default function ModelViewerAR({
  isOpen,
  onClose,
  modelUrlLeft,
  modelUrlRight,
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
  const [arSupported, setArSupported] = useState(false);
  const [currentModel, setCurrentModel] = useState<'left' | 'right' | 'both'>('both');
  const [arStatus, setArStatus] = useState<string>('');
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);
  const { toast: showToast } = useToast();
  const storeInfo = getStoreInfo();

  // Carregar script do model-viewer dinamicamente
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

    return () => {
      // Não remover o script para evitar recarregamentos
    };
  }, [isOpen]);

  // Criar model-viewer element dinamicamente
  useEffect(() => {
    if (!isOpen || !scriptLoaded || !containerRef.current) return;

    const modelUrl = currentModel === 'right' ? modelUrlRight : modelUrlLeft;
    if (!modelUrl) return;

    // Limpar container
    containerRef.current.innerHTML = '';

    // Criar model-viewer element
    const modelViewer = document.createElement('model-viewer');
    modelViewer.setAttribute('src', modelUrl);
    modelViewer.setAttribute('alt', `Modelo 3D do ${productName}`);
    modelViewer.setAttribute('ar', '');
    modelViewer.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
    modelViewer.setAttribute('ar-scale', 'fixed');
    modelViewer.setAttribute('ar-placement', 'floor');
    modelViewer.setAttribute('camera-controls', '');
    modelViewer.setAttribute('touch-action', 'pan-y');
    modelViewer.setAttribute('auto-rotate', '');
    modelViewer.setAttribute('auto-rotate-delay', '3000');
    modelViewer.setAttribute('rotation-per-second', '30deg');
    modelViewer.setAttribute('shadow-intensity', '1');
    modelViewer.setAttribute('shadow-softness', '0.5');
    modelViewer.setAttribute('exposure', '1');
    modelViewer.setAttribute('environment-image', 'neutral');
    modelViewer.setAttribute('loading', 'eager');
    modelViewer.setAttribute('reveal', 'auto');
    
    modelViewer.style.width = '100%';
    modelViewer.style.height = '100%';
    modelViewer.style.backgroundColor = 'transparent';
    modelViewer.style.setProperty('--poster-color', 'transparent');
    modelViewer.style.setProperty('--progress-bar-color', '#ef4444');
    modelViewer.style.setProperty('--progress-bar-height', '4px');

    // Event listeners
    modelViewer.addEventListener('load', () => {
      setLoading(false);
    });

    modelViewer.addEventListener('error', () => {
      setLoading(false);
    });

    modelViewer.addEventListener('ar-status', (e: Event) => {
      const customEvent = e as CustomEvent;
      setArStatus(customEvent.detail?.status || '');
    });

    // Criar botão AR customizado
    const arButton = document.createElement('button');
    arButton.setAttribute('slot', 'ar-button');
    arButton.className = 'absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg transition transform hover:scale-105';
    arButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
        <path d="M12 18h.01"/>
      </svg>
      Ver em AR
    `;
    modelViewer.appendChild(arButton);

    containerRef.current.appendChild(modelViewer);

    // Analytics
    if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'model_viewer_open', {
        event_category: 'AR',
        event_label: productName,
        product_id: productId,
      });
    }

  }, [isOpen, scriptLoaded, currentModel, modelUrlLeft, modelUrlRight, productName, productId]);

  // Detectar suporte a AR
  useEffect(() => {
    const checkARSupport = async () => {
      const isAndroid = /android/i.test(navigator.userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      if (isIOS) {
        setArSupported(true);
      } else if (isAndroid) {
        if ('xr' in navigator) {
          try {
            const supported = await (navigator as Navigator & { xr?: { isSessionSupported: (mode: string) => Promise<boolean> } }).xr?.isSessionSupported('immersive-ar');
            setArSupported(!!supported);
          } catch {
            setArSupported(false);
          }
        }
      }
    };

    if (isOpen) {
      checkARSupport();
    }
  }, [isOpen]);

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
    const msg = `Olá! Gostei do ${productName} tamanho ${selectedSize} que vi no provador virtual!`;
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

  const hasModel = modelUrlLeft || modelUrlRight;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900 to-black" role="dialog" aria-label="Visualizador 3D">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Box className="w-6 h-6 text-red-500" />
            <div>
              <h2 className="text-white font-bold text-lg truncate max-w-[200px] sm:max-w-none">
                {productName}
              </h2>
              <p className="text-gray-400 text-sm">{productBrand}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Model Viewer Container */}
      <div className="absolute inset-0 pt-20 pb-48">
        {hasModel ? (
          <>
            {/* Loading overlay */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4" />
                  <p className="text-lg font-medium">Carregando modelo 3D...</p>
                  <p className="text-gray-400 text-sm mt-2">Aguarde um momento</p>
                </div>
              </div>
            )}
            
            {/* Container para o model-viewer */}
            <div ref={containerRef} className="w-full h-full" />
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

      {/* Seletor de modelo (se tiver ambos) */}
      {modelUrlLeft && modelUrlRight && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-black/60 backdrop-blur-lg rounded-full p-1 flex items-center gap-1">
            <button
              onClick={() => { setCurrentModel('left'); setLoading(true); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                currentModel === 'left'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <ChevronLeft className="w-4 h-4 inline mr-1" />
              Esquerdo
            </button>
            <button
              onClick={() => { setCurrentModel('both'); setLoading(true); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                currentModel === 'both'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              Par
            </button>
            <button
              onClick={() => { setCurrentModel('right'); setLoading(true); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                currentModel === 'right'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              Direito
              <ChevronRight className="w-4 h-4 inline ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Status do AR */}
      {arStatus && (
        <div className="absolute top-36 left-1/2 -translate-x-1/2 bg-blue-600/80 backdrop-blur text-white px-4 py-2 rounded-full text-sm z-10">
          {arStatus === 'session-started' && '🎯 AR ativo - Mova o celular para encontrar o chão'}
          {arStatus === 'object-placed' && '✅ Tênis posicionado! Mova-se para ver de diferentes ângulos'}
          {arStatus === 'failed' && '❌ AR não disponível neste dispositivo'}
        </div>
      )}

      {/* Instruções */}
      <div className="absolute bottom-52 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-black/60 backdrop-blur-lg rounded-lg px-4 py-3 text-center max-w-sm">
          <p className="text-white text-sm mb-1">
            <RotateCcw className="w-4 h-4 inline mr-2" />
            Arraste para girar • Pinça para zoom
          </p>
          {arSupported && (
            <p className="text-green-400 text-xs">
              ✨ AR disponível! Clique em &quot;Ver em AR&quot; para visualizar em seu ambiente
            </p>
          )}
          {!arSupported && (
            <p className="text-yellow-400 text-xs">
              ⚠️ AR não suportado neste dispositivo. Use a visualização 3D acima.
            </p>
          )}
        </div>
      </div>

      {/* Barra inferior */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent z-20">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {/* Seletor de tamanho */}
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

          {/* Preço e botões */}
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
