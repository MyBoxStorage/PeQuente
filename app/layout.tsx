import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ClientOnlyComponents from "@/components/ClientOnlyComponents";
import { getStoreInfo } from "@/lib/api";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const storeInfo = getStoreInfo();

export const metadata: Metadata = {
  metadataBase: new URL('https://www.pequentecalcados.com.br'),
  title: {
    default: `${storeInfo.name} - Sua Loja de Tênis, Roupas e Acessórios`,
    template: `%s | ${storeInfo.name}`,
  },
  description: "Pé Quente Calçados - Sua loja de tênis, roupas e acessórios em Paraíba do Sul, RJ. Os melhores produtos das principais marcas: Nike, Adidas, Mizuno, Puma, Fila, Olympikus, Asics e mais. Retirada na loja com 5% de desconto no PIX.",
  keywords: ["tênis", "calçados", "Nike", "Adidas", "Mizuno", "Puma", "Fila", "Olympikus", "Asics", "Paraíba do Sul", "RJ", "loja de tênis", "calçados esportivos", "tênis esportivo", "Paraíba do Sul RJ"],
  authors: [{ name: storeInfo.name }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.pequentecalcados.com.br",
    siteName: storeInfo.name,
    title: `${storeInfo.name} - Sua Loja de Tênis, Roupas e Acessórios`,
    description: "Os melhores produtos das principais marcas em Paraíba do Sul, RJ",
    images: [
      {
        url: "https://www.pequentecalcados.com.br/images/logo.png",
        width: 1200,
        height: 630,
        alt: `${storeInfo.name} - Loja de Tênis e Acessórios`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${storeInfo.name} - Sua Loja de Tênis`,
    description: "Os melhores produtos das principais marcas",
    images: ["https://www.pequentecalcados.com.br/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.pequentecalcados.com.br",
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: storeInfo.name,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Praça Garcia 136/140',
    addressLocality: 'Paraíba do Sul',
    addressRegion: 'RJ',
    postalCode: '25850-000',
    addressCountry: 'BR',
  },
  telephone: storeInfo.phone,
  url: 'https://www.pequentecalcados.com.br',
  priceRange: '$$',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${bebasNeue.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-[#0a0a0a] text-white">
        <a href="#main-content" className="skip-to-content">
          Pular para o conteúdo principal
        </a>
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main id="main-content" className="flex-grow" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <ClientOnlyComponents />
      </body>
    </html>
  );
}
