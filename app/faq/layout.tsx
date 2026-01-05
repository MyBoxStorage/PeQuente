import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perguntas Frequentes',
  description: 'Tire suas dúvidas sobre produtos, formas de pagamento, trocas, devoluções e políticas da Pé Quente Calçados.',
  openGraph: {
    type: "website",
    url: "https://www.pequentecalcados.com.br/faq",
    siteName: "Pé Quente Calçados",
    title: "Perguntas Frequentes - Pé Quente Calçados",
    description: "Tire suas dúvidas sobre produtos, formas de pagamento, trocas, devoluções e políticas da Pé Quente Calçados.",
    images: [
      {
        url: "https://www.pequentecalcados.com.br/images/logo.png",
        width: 1200,
        height: 630,
        alt: "FAQ Pé Quente Calçados",
      },
    ],
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Perguntas Frequentes - Pé Quente Calçados",
    description: "Tire suas dúvidas sobre produtos, formas de pagamento, trocas, devoluções e políticas da Pé Quente Calçados.",
    images: ["https://www.pequentecalcados.com.br/images/logo.png"],
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
