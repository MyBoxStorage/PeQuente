'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ShoppingCart, MessageCircle, RotateCcw, Smartphone, Box, Camera } from 'lucide-react';
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
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  const [arStatus, setArStatus] = useState<string>('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const modelViewerRef = useRef<HTMLElement | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const { toast: showToast } = useToast();
  const storeInfo = getStoreInfo();

  // Detectar plataforma
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent;
      setIsAndroid(/android/i.test(ua));
      setIsIOS(/iPad|iPhone|iPod/.test(ua));
    }
  }, []);

  // Verificar permissão da câmera
  useEffect(() => {
    const checkCameraPermission = async () => {
      if (!isOpen) return;
      
      try {
        // Verificar se a API de permissões está disponível
        if ('permissions' in navigator) {
          const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
          setCameraPermission(result.state as 'prompt' | 'granted' | 'denied');
          
          result.addEventListener('change', () => {
            setCameraPermission(result.state as 'prompt' | 'granted' | 'denied');
          });
        }
      } catch {
        // Se não conseguir verificar, assume que precisa solicitar
        setCameraPermission('prompt');
      }
    };

    checkCameraPermission();
  }, [isOpen]);

  // Solicitar permissão da câmera
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Permissão concedida - parar o stream imediatamente
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission('granted');
      showToast({
        title: '✅ Câmera liberada!',
        description: 'Agora você pode usar o AR',
        variant: 'success',
      });
      return true;
    } catch (error) {
      console.error('Erro ao solicitar câmera:', error);
      setCameraPermission('denied');
      showToast({
        title: '❌ Câmera bloqueada',
        description: 'Permita o acesso à câmera nas configurações do navegador',
        variant: 'destructive',
      });
      return false;
    }
  };

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
  }, [isOpen]);

  // Criar model-viewer element dinamicamente
  useEffect(() => {
    if (!isOpen || !scriptLoaded || !containerRef.current || !modelUrl) return;

    // Limpar container
    containerRef.current.innerHTML = '';

    // URL absoluta do modelo (necessária para AR)
    const absoluteModelUrl = modelUrl.startsWith('http') 
      ? modelUrl 
      : `${window.location.origin}${modelUrl}`;

    // Criar model-viewer element
    const modelViewer = document.createElement('model-viewer');
    modelViewerRef.current = modelViewer;
    
    modelViewer.setAttribute('src', absoluteModelUrl);
    modelViewer.setAttribute('alt', `Modelo 3D do ${productName}`);
    
    // AR - Priorizar scene-viewer (igual Amazon)
    modelViewer.setAttribute('ar', '');
    modelViewer.setAttribute('ar-modes', 'scene-viewer webxr quick-look');
    modelViewer.setAttribute('ar-scale', 'auto');
    modelViewer.setAttribute('ar-placement', 'floor');
    
    // Controles de câmera - ROTAÇÃO LIVRE 360°
    modelViewer.setAttribute('camera-controls', '');
    modelViewer.setAttribute('touch-action', 'none');
    modelViewer.setAttribute('disable-pan', '');
    modelViewer.setAttribute('orbit-sensitivity', '1');
    modelViewer.setAttribute('interaction-prompt', 'auto');
    
    // Câmera inicial - vista frontal
    modelViewer.setAttribute('camera-orbit', '0deg 75deg 2.5m');
    modelViewer.setAttribute('camera-target', '0m 0m 0m');
    modelViewer.setAttribute('min-camera-orbit', 'auto auto 1m');
    modelViewer.setAttribute('max-camera-orbit', 'auto auto 5m');
    modelViewer.setAttribute('field-of-view', '30deg');
    
    // Auto-rotate suave
    modelViewer.setAttribute('auto-rotate', '');
    modelViewer.setAttribute('auto-rotate-delay', '5000');
    modelViewer.setAttribute('rotation-per-second', '20deg');
    modelViewer.setAttribute('interaction-prompt', 'none');
    
    // Iluminação e sombras
    modelViewer.setAttribute('shadow-intensity', '1');
    modelViewer.setAttribute('shadow-softness', '0.8');
    modelViewer.setAttribute('exposure', '1');
    modelViewer.setAttribute('environment-image', 'neutral');
    
    // Loading
    modelViewer.setAttribute('loading', 'eager');
    modelViewer.setAttribute('reveal', 'auto');
    
    // Estilos
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
      const status = customEvent.detail?.status || '';
      setArStatus(status);
      
      if (status === 'failed') {
        showToast({
          title: '⚠️ AR não disponível',
          description: 'Use o botão alternativo abaixo',
          variant: 'destructive',
        });
      }
    });

    // Verificar se AR está disponível
    modelViewer.addEventListener('ar-tracking', () => {
      setArSupported(true);
    });

    // Botão AR do model-viewer (slot)
    const arButton = document.createElement('button');
    arButton.setAttribute('slot', 'ar-button');
    arButton.className = 'hidden'; // Escondemos o botão nativo e usamos o nosso próprio
    modelViewer.appendChild(arButton);

    containerRef.current.appendChild(modelViewer);

    // Verificar suporte AR após carregar
    setTimeout(() => {
      // @ts-expect-error model-viewer custom element
      if (modelViewer.canActivateAR) {
        setArSupported(true);
      } else {
        // Assume que Android com Chrome suporta Scene Viewer
        if (isAndroid) {
          setArSupported(true);
        } else if (isIOS) {
          setArSupported(true);
        } else {
          setArSupported(false);
        }
      }
    }, 1000);

    // Analytics
    if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'view_3d_model', {
        event_category: '3D',
        event_label: productName,
        product_id: productId,
      });
    }

  }, [isOpen, scriptLoaded, modelUrl, productName, productId, isAndroid, isIOS, showToast]);

  // Função para abrir AR via model-viewer
  const handleOpenAR = async () => {
    // Solicitar permissão de câmera primeiro se necessário
    if (cameraPermission === 'prompt') {
      const granted = await requestCameraPermission();
      if (!granted) return;
    }

    if (cameraPermission === 'denied') {
      showToast({
        title: '📷 Câmera bloqueada',
        description: 'Permita o acesso à câmera nas configurações',
        variant: 'destructive',
      });
      return;
    }

    // Tentar ativar AR via model-viewer
    if (modelViewerRef.current) {
      try {
        // @ts-expect-error model-viewer custom element method
        await modelViewerRef.current.activateAR();
      } catch (error) {
        console.error('Erro ao ativar AR:', error);
        // Fallback para Scene Viewer direto
        openSceneViewerDirect();
      }
    }
  };

  // Fallback: Abrir Scene Viewer diretamente (Android)
  const openSceneViewerDirect = () => {
    const absoluteModelUrl = modelUrl.startsWith('http') 
      ? modelUrl 
      : `${window.location.origin}${modelUrl}`;

    if (isAndroid) {
      // Intent URL para Scene Viewer do Google
      const sceneViewerUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(absoluteModelUrl)}&mode=ar_preferred&title=${encodeURIComponent(productName)}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(window.location.href)};end;`;
      
      window.location.href = sceneViewerUrl;
    } else if (isIOS) {
      // Quick Look para iOS (precisa de arquivo .usdz ou .reality)
      // Como temos .glb, o model-viewer já deve ter tentado converter
      showToast({
        title: '📱 iOS detectado',
        description: 'O AR será aberto automaticamente pelo sistema',
        variant: 'default',
      });
    }
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

      {/* Solicitar permissão de câmera */}
      {cameraPermission === 'prompt' && (isAndroid || isIOS) && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-sm">
          <div className="bg-blue-600 rounded-lg p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <Camera className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium text-sm">Libere a câmera para AR</p>
                <p className="text-blue-100 text-xs mt-1">Permita o acesso para ver o tênis no seu ambiente</p>
                <button
                  onClick={requestCameraPermission}
                  className="mt-3 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition"
                >
                  Liberar Câmera
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Model Viewer Container */}
      <div className="absolute inset-0 pt-20 pb-56">
        {modelUrl ? (
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

      {/* Status do AR */}
      {arStatus && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-blue-600/80 backdrop-blur text-white px-4 py-2 rounded-full text-sm z-10">
          {arStatus === 'session-started' && '🎯 AR ativo - Aponte para uma superfície'}
          {arStatus === 'object-placed' && '✅ Posicionado! Mova e redimensione como quiser'}
          {arStatus === 'failed' && '❌ Tentando método alternativo...'}
        </div>
      )}

      {/* Botão AR grande e visível */}
      {(isAndroid || isIOS) && !loading && (
        <div className="absolute bottom-56 left-1/2 -translate-x-1/2 z-10">
          <button
            onClick={handleOpenAR}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 shadow-2xl transition transform hover:scale-105 active:scale-95"
          >
            <Smartphone className="w-6 h-6" />
            <span className="text-lg">Ver na sua Estante</span>
          </button>
          <p className="text-center text-gray-400 text-xs mt-2">
            Posicione o tênis em qualquer lugar
          </p>
        </div>
      )}

      {/* Instruções */}
      <div className="absolute bottom-48 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-sm">
        <div className="bg-black/60 backdrop-blur-lg rounded-lg px-4 py-3 text-center">
          <p className="text-white text-sm mb-1">
            <RotateCcw className="w-4 h-4 inline mr-2" />
            Arraste para girar • Pinça para zoom
          </p>
          {arSupported === true && (
            <p className="text-green-400 text-xs">
              ✅ AR disponível no seu dispositivo
            </p>
          )}
          {arSupported === false && (
            <p className="text-yellow-400 text-xs">
              ⚠️ AR não suportado - use a visualização 3D acima
            </p>
          )}
          {arSupported === null && (isAndroid || isIOS) && (
            <p className="text-blue-400 text-xs">
              🔍 Verificando suporte a AR...
            </p>
          )}
        </div>
      </div>

      {/* Barra inferior */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent z-20">
        <div className="max-w-4xl mx-auto p-4 space-y-3">
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
