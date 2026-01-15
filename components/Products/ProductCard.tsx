'use client';

import { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, formatInstallment, getModelUrls } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/ui/use-toast';

const LazyArTryOn = lazy(() => import('./ArTryOn'));

// Declaração global para window.gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipStage, setFlipStage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [arOpen, setArOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLUListElement>(null);
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  const images = product.images && product.images.length > 0 ? product.images : [];
  const hasMultipleImages = images.length > 1;

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Navegar diretamente para a página do produto
    router.push(`/produtos/${product.slug}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.images || product.images.length === 0) {
      toast({
        title: 'Erro',
        description: 'Produto sem imagem disponível',
        variant: 'destructive',
      });
      return;
    }

    if (product.stock === 0) {
      toast({
        title: 'Produto indisponível',
        description: 'Este produto está fora de estoque',
        variant: 'destructive',
      });
      return;
    }

    // Adicionar ao carrinho (tamanho padrão será o primeiro disponível ou undefined)
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined;
    
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0],
      brand: product.brand,
      size: defaultSize,
    });

    // Toast notification
    toast({
      title: 'Adicionado ao carrinho!',
      description: `${product.name} foi adicionado. Venha retirar na loja!`,
      variant: 'success',
    });
  };

  const handleFlipBack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFlipStage('flip190');
    setTimeout(() => {
      setFlipStage('flip90');
      setTimeout(() => {
        setFlipStage('flip-10');
        setIsFlipped(false);
        setTimeout(() => {
          setFlipStage('');
        }, 100);
      }, 150);
    }, 50);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const handleTryOnOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setArOpen(true);
    
    // Analytics event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'try_on_button_click', {
        event_category: 'AR',
        event_label: product.name,
        product_id: product.id,
      });
    }
  };

  useEffect(() => {
    if (carouselRef.current && isFlipped) {
      carouselRef.current.style.left = `-${currentImageIndex * 100}%`;
    }
  }, [currentImageIndex, isFlipped]);

  return (
    <div
      className="product-card-3d-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (!isFlipped) {
          setFlipStage('');
        }
      }}
    >
      <div
        ref={cardRef}
        className={`product-card-3d ${isHovered ? 'animate' : ''} ${flipStage}`}
      >
        {/* Frente do card */}
        <div className={`product-card-front ${isFlipped ? 'hidden' : ''}`}>
          <div className="product-card-shadow"></div>
          <Link href={`/produtos/${product.slug}`} className="block">
            <div className="relative aspect-square bg-[#252525] overflow-hidden">
              {images.length > 0 ? (
                <>
                  <Image
                    src={images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 346px"
                    quality={85}
                    loading="lazy"
                  />
                  <div className="product-image-overlay"></div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Sem imagem
                </div>
              )}

              {/* Badge de promoção */}
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <div className="absolute top-2 right-2 bg-[#DC143C] text-white text-xs font-bold px-2 py-1 rounded z-10">
                  {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                </div>
              )}

              {/* Badge de novo */}
              {product.featured && (
                <div className="absolute top-2 left-2 bg-[#FFD700] text-[#0a0a0a] text-xs font-bold px-2 py-1 rounded z-10">
                  Novo
                </div>
              )}

              {/* Botão View Details */}
              <button
                className="product-view-details"
                onClick={handleViewDetails}
              >
                Ver detalhes
              </button>
            </div>

          </Link>
          
          {/* Informações do produto */}
          <div className="product-stats-container">
            <Link href={`/produtos/${product.slug}`} className="block">
              <div className="product-stats-content">
                <span className="product-price">{formatPrice(product.price)}</span>
                <span className="product-name">{product.name}</span>
                <p>{product.brand}</p>
              </div>
            </Link>
            {/* Botões de Ação */}
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-[#FF0000] hover:bg-[#FF0000]/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                aria-label={`Adicionar ${product.name} ao carrinho`}
              >
                <ShoppingBag size={16} />
                {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Indisponível'}
              </button>
              <button
                onClick={handleTryOnOpen}
                className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white font-semibold py-2 px-4 rounded-lg transition text-sm whitespace-nowrap"
                aria-label={`Provar virtualmente ${product.name}`}
              >
                Provar AR
              </button>
            </div>
          </div>
        </div>

        {/* Verso do card */}
        <div className={`product-card-back ${!isFlipped ? 'hidden' : ''}`}>
          <div className="product-card-shadow"></div>
          <div className="product-carousel">
            {hasMultipleImages ? (
              <ul ref={carouselRef} className="product-carousel-list">
                {images.map((image, index) => (
                  <li key={index} className="product-carousel-item">
                    <Image
                      src={image}
                      alt={`${product.name} - Imagem ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="346px"
                      quality={90}
                    />
                  </li>
                ))}
              </ul>
            ) : images.length > 0 ? (
              <div className="relative w-full h-full">
                <Image
                  src={images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="346px"
                  quality={90}
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Sem imagem
              </div>
            )}

            {hasMultipleImages && (
              <div className="product-carousel-arrows">
                <button
                  className={`product-carousel-prev ${currentImageIndex > 0 ? 'visible' : ''}`}
                  onClick={handlePrevImage}
                  aria-label="Imagem anterior"
                >
                  <div className="arrow-y"></div>
                  <div className="arrow-x"></div>
                </button>
                <button
                  className={`product-carousel-next ${currentImageIndex < images.length - 1 ? 'visible' : ''}`}
                  onClick={handleNextImage}
                  aria-label="Próxima imagem"
                >
                  <div className="arrow-y"></div>
                  <div className="arrow-x"></div>
                </button>
              </div>
            )}
          </div>

          {/* Botão para voltar */}
          <button className="product-flip-back" onClick={handleFlipBack} aria-label="Voltar">
            <div className="flip-x"></div>
            <div className="flip-y"></div>
          </button>
        </div>
      </div>

      {/* Modal ArTryOn */}
      {arOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a] text-white">Carregando AR...</div>}>
          <LazyArTryOn
            isOpen={arOpen}
            onClose={() => setArOpen(false)}
            modelUrlLeft={getModelUrls(product.slug).left}
            modelUrlRight={getModelUrls(product.slug).right}
            productName={product.name}
            productId={product.id}
            productPrice={product.price}
            productSlug={product.slug}
            productImage={product.images[0] || ''}
            productBrand={product.brand}
            sizes={product.sizes || []}
            colors={product.specs?.color || []}
          />
        </Suspense>
      )}
    </div>
  );
}
