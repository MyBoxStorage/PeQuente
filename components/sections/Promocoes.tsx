import Link from 'next/link';
import { getAllProducts } from '@/lib/api';
import ProductCard from '@/components/Products/ProductCard';

export default function Promocoes() {
  const allProducts = getAllProducts();
  
  // Filtrar produtos em promoção (com compareAtPrice maior que price)
  const promocoes = allProducts
    .filter((product) => product.compareAtPrice && product.compareAtPrice > product.price)
    .slice(0, 6); // Limitar a 6 produtos

  if (promocoes.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Promoções Especiais
            </h2>
            <p className="text-gray-300 text-lg">
              Aproveite nossos melhores descontos
            </p>
          </div>
          <Link
            href="/produtos"
            className="text-[#FF0000] hover:text-[#FF0000]/80 transition flex items-center gap-2"
            prefetch
          >
            Ver todas as promoções
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {promocoes.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
