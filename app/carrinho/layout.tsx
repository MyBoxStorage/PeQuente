import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carrinho de Compras | Pé Quente Calçados',
  description: 'Revise seus produtos no carrinho de compras. Finalize seu pedido e ganhe 5% de desconto no PIX. Retirada na loja em Paraíba do Sul, RJ.',
  keywords: ['carrinho', 'compras', 'pedido', 'checkout', 'Pé Quente Calçados', 'Paraíba do Sul', 'desconto PIX'],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.pequentecalcados.com.br/carrinho",
    siteName: "Pé Quente Calçados",
    title: "Carrinho de Compras | Pé Quente Calçados",
    description: "Revise seus produtos no carrinho de compras. Finalize seu pedido e ganhe 5% de desconto no PIX. Retirada na loja em Paraíba do Sul, RJ.",
    images: [
      {
        url: "https://www.pequentecalcados.com.br/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Carrinho de Compras - Pé Quente Calçados",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Carrinho de Compras | Pé Quente Calçados",
    description: "Revise seus produtos no carrinho de compras. Finalize seu pedido e ganhe 5% de desconto no PIX.",
    images: ["https://www.pequentecalcados.com.br/images/logo.png"],
  },
  alternates: {
    canonical: "https://www.pequentecalcados.com.br/carrinho",
  },
  robots: {
    index: false, // Carrinho geralmente não deve ser indexado
    follow: true,
  },
};

export default function CarrinhoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
