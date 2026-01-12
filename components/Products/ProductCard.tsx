'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, formatInstallment } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipStage, setFlipStage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLUListElement>(null);

  const images = product.images && product.images.length > 0 ? product.images : [];
  const hasMultipleImages = images.length > 1;

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Navegar diretamente para a página do produto
    router.push(`/produtos/${product.slug}`);
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
          <Link href={`/produtos/${product.slug}`} className="block h-full">
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

            {/* Informações do produto */}
            <div className="product-stats-container">
              <div className="product-stats-content">
                <span className="product-price">{formatPrice(product.price)}</span>
                <span className="product-name">{product.name}</span>
                <p>{product.brand}</p>
              </div>
            </div>
          </Link>
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
    </div>
  );
}
