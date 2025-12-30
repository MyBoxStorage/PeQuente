'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice, formatInstallment } from '@/lib/utils';
import { getProductsByCategory, getAllCategories } from '@/lib/api';
import ProductCard from './ProductCard';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');

  const categories = getAllCategories();
  const category = categories.find(cat => cat.id === product.categoryId);
  const categorySlug = category?.slug || '';

  const relatedProducts = categorySlug
    ? getProductsByCategory(categorySlug).filter(p => p.id !== product.id).slice(0, 4)
    : [];

  // Schema.org para produto
  useEffect(() => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'BRL',
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
      image: product.images && product.images.length > 0 ? product.images : [],
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [product]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-[#FFD700]">Home</Link>
          {' / '}
          <Link href="/produtos" className="hover:text-[#FFD700]">Produtos</Link>
          {' / '}
          <span className="text-white">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Galeria de imagens */}
          <div>
            <div className="aspect-square bg-[#1a1a1a] rounded-lg overflow-hidden mb-4">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Sem imagem
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? 'border-[#FFD700]'
                        : 'border-transparent hover:border-gray-500'
                    } transition`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do produto */}
          <div>
            <p className="text-[#FFD700] text-sm mb-2">{product.brand}</p>
            <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
            
            <div className="flex items-baseline space-x-4 mb-6">
              <span className="text-3xl font-bold text-[#FFD700]">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <span className="bg-[#DC143C] text-white text-sm font-bold px-2 py-1 rounded">
                    {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-400 mb-2">
              {formatInstallment(product.price)}
            </p>

            <div className="border-t border-b border-[#252525] py-6 my-6">
              <p className="text-gray-300 whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Seleção de tamanho */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-white font-medium mb-3">
                  Tamanho
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border-2 rounded-lg transition ${
                        selectedSize === size
                          ? 'border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700]'
                          : 'border-[#252525] text-white hover:border-gray-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Botão de ação */}
            <div className="space-y-4">
              <button
                className="w-full bg-[#FFD700] text-[#0a0a0a] font-bold py-4 px-8 rounded-lg hover:bg-[#FFD700]/90 transition text-lg"
              >
                Entre em Contato
              </button>
              <button
                className="w-full border-2 border-[#252525] text-white font-medium py-4 px-8 rounded-lg hover:border-[#FFD700] transition"
              >
                Adicionar aos Favoritos
              </button>
            </div>

            {/* Informações adicionais */}
            <div className="mt-8 space-y-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="text-[#FFD700]">✓</span>
                <span>Estoque disponível</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#FFD700]">✓</span>
                <span>Entrega para Paraíba do Sul</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#FFD700]">✓</span>
                <span>5% de desconto no PIX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Produtos relacionados */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">Produtos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
