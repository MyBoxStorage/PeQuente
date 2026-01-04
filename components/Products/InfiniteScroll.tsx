'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

interface InfiniteScrollProps {
  products: Product[];
  itemsPerPage?: number;
  onLoadMore?: () => void;
}

export default function InfiniteScroll({
  products,
  itemsPerPage = 12,
  onLoadMore,
}: InfiniteScrollProps) {
  const [displayedCount, setDisplayedCount] = useState(itemsPerPage);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const displayedProducts = products.slice(0, displayedCount);
  const hasMore = displayedCount < products.length;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    // Simular delay para melhor UX
    setTimeout(() => {
      setDisplayedCount((prev) => prev + itemsPerPage);
      setIsLoading(false);
      onLoadMore?.();
    }, 300);
  }, [isLoading, hasMore, itemsPerPage, onLoadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, loadMore]);

  if (products.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Observer target e loading skeleton */}
      {hasMore && (
        <div ref={observerTarget} className="mt-8">
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: itemsPerPage }).map((_, i) => (
                <ProductCardSkeleton key={`skeleton-${i}`} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Botão manual como fallback */}
      {hasMore && !isLoading && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-[#2d2d2d] border border-[#353535] text-white rounded-lg hover:bg-[#252525] hover:border-[#FF0000] transition-all duration-250"
          >
            Carregar mais produtos
          </button>
        </div>
      )}
    </>
  );
}
