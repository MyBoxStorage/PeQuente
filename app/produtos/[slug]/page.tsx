import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { getProductBySlug, getAllProducts, getStoreInfo } from '@/lib/api';
import { formatPrice, formatInstallment } from '@/lib/utils';
import ProductGallery from '@/components/product/ProductGallery';
import ProductDetails from '@/components/product/ProductDetails';
import RelatedProducts from '@/components/product/RelatedProducts';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Produto não encontrado',
    };
  }

  return {
    title: `${product.name} - ${product.brand}`,
    description: product.description || product.shortDescription || `Compre ${product.name} da ${product.brand} na Pé Quente Calçados.`,
    openGraph: {
      title: `${product.name} - ${product.brand}`,
      description: product.description || product.shortDescription || '',
      images: product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const storeInfo = getStoreInfo();

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `https://www.pequentecalcados.com.br/produtos/${product.slug}`,
      priceCurrency: 'BRL',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Store',
        name: storeInfo.name,
      },
    },
  };

  return (
    <>
      <Script
        id="product-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="min-h-screen bg-[#0a0a0a] py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-400">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-[#FF0000] transition">
                  Início
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/produtos" className="hover:text-[#FF0000] transition">
                  Produtos
                </Link>
              </li>
              <li>/</li>
              <li className="text-white">{product.name}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Galeria de Imagens */}
            <ProductGallery images={product.images} productName={product.name} />

            {/* Detalhes do Produto */}
            <ProductDetails product={product} />
          </div>

          {/* Produtos Relacionados */}
          <RelatedProducts currentProductId={product.id} categoryId={product.categoryId} />
        </div>
      </div>
    </>
  );
}
