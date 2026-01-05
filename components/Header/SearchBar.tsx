'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { searchProducts } from '@/lib/api';
import { Product } from '@/types';

interface SearchBarProps {
  onClose: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length >= 2) {
      const searchResults = searchProducts(value);
      setResults(searchResults.slice(0, 5));
    } else {
      setResults([]);
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute top-full right-0 mt-2 w-[380px] bg-[#1a1a1a] border border-[#353535] rounded-lg shadow-xl z-50 animate-in fade-in-0 slide-in-from-top-2 duration-300"
    >
      <div className="p-4">
        {/* Container do input com ícone */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Buscar produtos..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-10 h-11 bg-[#252525] border-[#353535] focus-visible:ring-[#FF0000]"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              aria-label="Limpar busca"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Resultados da busca */}
        {results.length > 0 && (
          <div className="mt-3 space-y-1 max-h-[400px] overflow-y-auto">
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/produtos/${product.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-[#252525] transition-colors group"
              >
                {/* Imagem do produto */}
                <div className="relative w-14 h-14 bg-[#252525] rounded-md overflow-hidden flex-shrink-0">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                      quality={75}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                      N/A
                    </div>
                  )}
                </div>
                
                {/* Informações do produto */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-sm truncate group-hover:text-[#FF0000] transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-[#FF5555] font-bold text-sm">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(product.price)}
                    </p>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-gray-500 text-xs line-through">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Mensagem quando não há resultados mas há busca */}
        {query.length >= 2 && results.length === 0 && (
          <div className="mt-3 text-center py-6">
            <p className="text-gray-400 text-sm">Nenhum produto encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
