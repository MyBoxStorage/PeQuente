import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Produtos',
  description: 'Explore nossa coleção completa de tênis, calçados e acessórios das melhores marcas: Nike, Adidas, Mizuno, Puma e mais.',
};

export default function ProdutosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
