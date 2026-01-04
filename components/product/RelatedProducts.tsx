import { getAllProducts } from '@/lib/api';
import ProductCard from '@/components/Products/ProductCard';
import Link from 'next/link';

interface RelatedProductsProps {
  currentProductId: string;
  categoryId: string;
}

export default function RelatedProducts({ currentProductId, categoryId }: RelatedProductsProps) {
  const allProducts = getAllProducts();
  
  // Filtrar produtos da mesma categoria, excluindo o produto atual
  const relatedProducts = allProducts
    .filter(
      (product) => 
        product.id !== currentProductId && 
        product.categoryId === categoryId && 
        product.active
    )
    .slice(0, 4); // Limitar a 4 produtos

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-[#252525] pt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">Produtos Relacionados</h2>
        <Link
          href="/produtos"
          className="text-[#FF0000] hover:text-[#FF0000]/80 transition flex items-center gap-2"
        >
          Ver todos
          <span>→</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
