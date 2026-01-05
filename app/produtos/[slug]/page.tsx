import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { getProductBySlug, getAllProducts, getStoreInfo, getAllCategories } from '@/lib/api';
import { formatPrice, formatInstallment } from '@/lib/utils';
import ProductGallery from '@/components/product/ProductGallery';
import ProductDetails from '@/components/product/ProductDetails';
import RelatedProducts from '@/components/product/RelatedProducts';
import { Breadcrumb } from '@/components/ui/breadcrumb';

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

  const productUrl = `https://www.pequentecalcados.com.br/produtos/${slug}`;
  const productImage = product.images.length > 0 
    ? product.images[0].startsWith('http') 
      ? product.images[0] 
      : `https://www.pequentecalcados.com.br${product.images[0]}`
    : 'https://www.pequentecalcados.com.br/images/logo.png';

  return {
    title: `${product.name} - ${product.brand} | Pé Quente Calçados`,
    description: product.description || product.shortDescription || `Compre ${product.name} da ${product.brand} na Pé Quente Calçados. Retirada na loja em Paraíba do Sul, RJ.`,
    keywords: [product.name, product.brand, 'tênis', 'calçados', 'Paraíba do Sul', 'RJ', 'Pé Quente Calçados'],
    openGraph: {
      type: "product",
      url: productUrl,
      siteName: "Pé Quente Calçados",
      title: `${product.name} - ${product.brand} | Pé Quente Calçados`,
      description: product.description || product.shortDescription || `Compre ${product.name} da ${product.brand} na Pé Quente Calçados. Retirada na loja em Paraíba do Sul, RJ.`,
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      locale: "pt_BR",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - ${product.brand} | Pé Quente Calçados`,
      description: product.description || product.shortDescription || `Compre ${product.name} da ${product.brand} na Pé Quente Calçados.`,
      images: [productImage],
    },
    alternates: {
      canonical: productUrl,
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
          <Breadcrumb
            className="mb-6"
            items={[
              { label: 'Produtos', href: '/produtos' },
              ...(product.categoryId
                ? (() => {
                    const categories = getAllCategories();
                    const category = categories.find((c: { id: string }) => c.id === product.categoryId);
                    return category
                      ? [
                          {
                            label: category.name,
                            href: `/produtos?categoria=${category.slug}`,
                          },
                        ]
                      : [];
                  })()
                : []),
              { label: product.name },
            ]}
          />

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
