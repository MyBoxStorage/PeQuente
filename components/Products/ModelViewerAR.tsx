'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ShoppingCart, MessageCircle, Box, Smartphone } from 'lucide-react';
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
  const [canActivateAR, setCanActivateAR] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const modelViewerRef = useRef<HTMLElement | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const { toast: showToast } = useToast();
  const storeInfo = getStoreInfo();

  // Detectar dispositivo
  const isAndroid = typeof window !== 'undefined' && /android/i.test(navigator.userAgent);
  const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isMobile = isAndroid || isIOS;

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

  // Criar model-viewer - ESTILO AMAZON
  useEffect(() => {
    if (!isOpen || !scriptLoaded || !containerRef.current || !modelUrl) return;

    containerRef.current.innerHTML = '';

    // URL absoluta para AR funcionar
    const absoluteModelUrl = modelUrl.startsWith('http') 
      ? modelUrl 
      : `${window.location.origin}${modelUrl}`;

    const modelViewer = document.createElement('model-viewer');
    modelViewerRef.current = modelViewer;
    
    modelViewer.setAttribute('src', absoluteModelUrl);
    modelViewer.setAttribute('alt', `Modelo 3D do ${productName}`);
    
    // AR NATIVO - Scene Viewer (Android) / Quick Look (iOS)
    modelViewer.setAttribute('ar', '');
    modelViewer.setAttribute('ar-modes', 'scene-viewer webxr quick-look');
    modelViewer.setAttribute('ar-scale', 'auto');
    modelViewer.setAttribute('ar-placement', 'floor');
    
    // CONTROLES FLUIDOS - Otimizados para performance
    modelViewer.setAttribute('camera-controls', '');
    modelViewer.setAttribute('touch-action', 'pan-y');
    modelViewer.setAttribute('interaction-prompt', 'auto');
    modelViewer.setAttribute('interaction-prompt-style', 'wiggle');
    modelViewer.setAttribute('interpolation-decay', '100'); // Mais responsivo
    
    // CÂMERA - Vista frontal elegante
    modelViewer.setAttribute('camera-orbit', '0deg 75deg 210%');
    modelViewer.setAttribute('camera-target', 'auto auto auto');
    modelViewer.setAttribute('field-of-view', '30deg');
    modelViewer.setAttribute('max-field-of-view', '45deg');
    modelViewer.setAttribute('min-field-of-view', '20deg');
    
    // ILUMINAÇÃO LEVE (performance otimizada)
    modelViewer.setAttribute('shadow-intensity', '0.5'); // Sombra mais leve
    // Remover shadow-softness (pesado)
    modelViewer.setAttribute('exposure', '1');
    modelViewer.setAttribute('environment-image', 'neutral');
    // Remover skybox-height (pesado)
    
    // LOADING - Carregar imediatamente
    modelViewer.setAttribute('loading', 'eager'); // Carrega logo ao abrir
    modelViewer.setAttribute('reveal', 'auto'); // Mostra automaticamente
    modelViewer.setAttribute('poster', productImage); // Imagem enquanto carrega
    
    // ESTILOS CSS - Fundo gradiente elegante igual Amazon
    modelViewer.style.width = '100%';
    modelViewer.style.height = '100%';
    modelViewer.style.backgroundColor = '#f5f5f5';
    modelViewer.style.setProperty('--poster-color', '#f5f5f5');
    modelViewer.style.setProperty('--progress-bar-color', '#ef4444');
    modelViewer.style.setProperty('--progress-bar-height', '3px');

    // Eventos
    modelViewer.addEventListener('load', () => {
      setLoading(false);
      // Verificar se pode ativar AR
      // @ts-expect-error model-viewer custom element
      if (modelViewer.canActivateAR) {
        setCanActivateAR(true);
      } else if (isMobile) {
        // Em mobile, assume que pode (Scene Viewer funciona mesmo sem detectar)
        setCanActivateAR(true);
      }
    });
    modelViewer.addEventListener('error', () => setLoading(false));

    // BOTÃO AR NATIVO ESCONDIDO (será ativado pelo nosso CTA)
    const arButton = document.createElement('button');
    arButton.setAttribute('slot', 'ar-button');
    arButton.id = 'ar-button-hidden';
    arButton.style.display = 'none'; // Escondido - usamos nosso próprio botão
    modelViewer.appendChild(arButton);

    containerRef.current.appendChild(modelViewer);

    // Analytics
    if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'view_3d_model', {
        event_category: '3D',
        event_label: productName,
        product_id: productId,
      });
    }
  }, [isOpen, scriptLoaded, modelUrl, productName, productId, productImage, isMobile]);

  // Função para ativar AR
  const handleActivateAR = useCallback(async () => {
    if (!modelViewerRef.current) return;
    
    try {
      // @ts-expect-error model-viewer custom element method
      await modelViewerRef.current.activateAR();
      
      // Analytics
      if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'activate_ar', {
          event_category: 'AR',
          event_label: productName,
          product_id: productId,
        });
      }
    } catch (error) {
      console.error('Erro ao ativar AR:', error);
      showToast({
        title: '📱 AR não disponível',
        description: 'Seu dispositivo pode não suportar AR',
        variant: 'destructive',
      });
    }
  }, [productName, productId, showToast]);

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
    <div className="fixed inset-0 z-50 bg-white" role="dialog" aria-label="Visualizador 3D">
      {/* Header - Estilo limpo */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Box className="w-6 h-6 text-orange-500" />
            <div>
              <h2 className="text-gray-900 font-bold text-lg truncate max-w-[200px] sm:max-w-none">
                {productName}
              </h2>
              <p className="text-gray-500 text-sm">{productBrand}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Model Viewer Container - ESTANTE 3D */}
      <div className="absolute inset-0 pt-16 pb-48 bg-gradient-to-b from-gray-100 via-gray-50 to-white">
        {modelUrl ? (
          <>
            {/* Loading */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-3 border-orange-500 border-t-transparent mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Carregando modelo 3D...</p>
                </div>
              </div>
            )}
            
            {/* Container do model-viewer */}
            <div ref={containerRef} className="w-full h-full" />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Box className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-xl">Modelo 3D não disponível</p>
            </div>
          </div>
        )}
      </div>

      {/* BOTÃO CTA - VER NA SUA ESTANTE */}
      {isMobile && !loading && (
        <div className="absolute bottom-48 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-sm">
          <button
            onClick={handleActivateAR}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Smartphone className="w-6 h-6" />
            <div className="text-left">
              <span className="text-lg block">Ver na sua Estante</span>
              <span className="text-xs opacity-80 font-normal">Toque para visualizar em AR</span>
            </div>
          </button>
        </div>
      )}

      {/* Desktop: mostrar instruções */}
      {!isMobile && !loading && (
        <div className="absolute bottom-48 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-6 py-2 shadow-lg">
            <p className="text-gray-600 text-sm text-center">
              👆 Arraste para girar • 🤏 Pinça para zoom
            </p>
          </div>
        </div>
      )}

      {/* Barra inferior - Estilo Amazon */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
        <div className="max-w-4xl mx-auto p-4 space-y-3">
          {/* Seletor de tamanho */}
          {sizes.length > 0 && (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-gray-500 text-sm">Tamanho:</span>
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[44px] h-10 px-3 rounded-lg font-medium transition border ${
                    selectedSize === size
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

          {/* Preço e botões */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                R$ {productPrice.toFixed(2).replace('.', ',')}
              </p>
              <p className="text-xs text-gray-500">
                ou 12x de R$ {(productPrice / 12).toFixed(2).replace('.', ',')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleWhatsApp}
                className="h-12 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition flex items-center gap-2"
                aria-label="Contato via WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="h-12 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition flex items-center gap-2"
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
