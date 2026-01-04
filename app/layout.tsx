import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { getStoreInfo } from "@/lib/api";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const storeInfo = getStoreInfo();

export const metadata: Metadata = {
  title: {
    default: `${storeInfo.name} - Sua Loja de Tênis, Roupas e Acessórios`,
    template: `%s | ${storeInfo.name}`,
  },
  description: "Pé Quente Calçados - Sua loja de tênis, roupas e acessórios em Paraíba do Sul, RJ. Os melhores produtos das principais marcas: Nike, Adidas, Mizuno, Puma e mais.",
  keywords: ["tênis", "calçados", "Nike", "Adidas", "Mizuno", "Puma", "Paraíba do Sul", "RJ"],
  authors: [{ name: storeInfo.name }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.pequentecalcados.com.br",
    siteName: storeInfo.name,
    title: `${storeInfo.name} - Sua Loja de Tênis, Roupas e Acessórios`,
    description: "Os melhores produtos das principais marcas em Paraíba do Sul, RJ",
  },
  twitter: {
    card: "summary_large_image",
    title: `${storeInfo.name} - Sua Loja de Tênis`,
    description: "Os melhores produtos das principais marcas",
  },
  robots: {
    index: true,
    follow: true,
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
    <html lang="pt-BR" className={inter.variable}>
      <body className="antialiased min-h-screen flex flex-col bg-[#0a0a0a] text-white">
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
