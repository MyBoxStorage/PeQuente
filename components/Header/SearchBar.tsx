'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { searchProducts } from '@/lib/api';
import { Product } from '@/types';

interface SearchBarProps {
  onClose: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length >= 2) {
      const searchResults = searchProducts(value);
      setResults(searchResults.slice(0, 5)); // Limita a 5 resultados
    } else {
      setResults([]);
    }
  };

  return (
    <div className="bg-[#1a1a1a] border-t border-[#252525]">
      <div className="container mx-auto px-4 py-4">
        <div className="relative">
          <div className="flex items-center">
            <Search className="absolute left-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-[#252525] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              autoFocus
            />
            <button
              onClick={onClose}
              className="absolute right-3 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Resultados da busca */}
          {results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-[#252525] rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/produtos/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center space-x-4 p-4 hover:bg-[#252525] transition"
                >
                  <div className="w-16 h-16 bg-[#252525] rounded flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{product.name}</h3>
                    <p className="text-[#FFD700] font-bold">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
