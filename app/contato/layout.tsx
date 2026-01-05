import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Entre em contato com a Pé Quente Calçados. Estamos localizados em Paraíba do Sul, RJ. Tire suas dúvidas sobre produtos, formas de pagamento e muito mais.',
  openGraph: {
    type: "website",
    url: "https://www.pequentecalcados.com.br/contato",
    siteName: "Pé Quente Calçados",
    title: "Contato - Pé Quente Calçados",
    description: "Entre em contato com a Pé Quente Calçados. Estamos localizados em Paraíba do Sul, RJ.",
    images: [
      {
        url: "https://www.pequentecalcados.com.br/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Contato Pé Quente Calçados",
      },
    ],
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contato - Pé Quente Calçados",
    description: "Entre em contato com a Pé Quente Calçados. Estamos localizados em Paraíba do Sul, RJ.",
    images: ["https://www.pequentecalcados.com.br/images/logo.png"],
  },
};

export default function ContatoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
