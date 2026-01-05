import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Produtos - Tênis, Calçados e Acessórios | Pé Quente Calçados',
  description: 'Explore nossa coleção completa de tênis, calçados e acessórios das melhores marcas: Nike, Adidas, Mizuno, Puma, Fila, Olympikus, Asics e mais. Encontre o produto ideal para você em Paraíba do Sul, RJ.',
  keywords: ['produtos', 'tênis', 'calçados', 'acessórios', 'Nike', 'Adidas', 'Mizuno', 'Puma', 'Fila', 'Olympikus', 'Asics', 'Paraíba do Sul', 'RJ', 'catálogo'],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.pequentecalcados.com.br/produtos",
    siteName: "Pé Quente Calçados",
    title: "Produtos - Tênis, Calçados e Acessórios | Pé Quente Calçados",
    description: "Explore nossa coleção completa de tênis, calçados e acessórios das melhores marcas. Encontre o produto ideal para você em Paraíba do Sul, RJ.",
    images: [
      {
        url: "https://www.pequentecalcados.com.br/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Catálogo de Produtos - Pé Quente Calçados",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Produtos - Tênis, Calçados e Acessórios | Pé Quente Calçados",
    description: "Explore nossa coleção completa de tênis, calçados e acessórios das melhores marcas.",
    images: ["https://www.pequentecalcados.com.br/images/logo.png"],
  },
  alternates: {
    canonical: "https://www.pequentecalcados.com.br/produtos",
  },
};

export default function ProdutosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
