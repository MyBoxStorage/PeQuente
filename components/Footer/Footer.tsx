'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { getStoreInfo, getAllCategories } from '@/lib/api';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  const storeInfo = getStoreInfo();
  const categories = getAllCategories();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode integrar com sua API/email service
    console.log('Newsletter subscription:', email);
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  const [isHovered, setIsHovered] = useState(false);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: storeInfo.name,
    image: 'https://www.pequentecalcados.com.br/images/logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Praça Garcia 136/140',
      addressLocality: 'Paraíba do Sul',
      addressRegion: 'RJ',
      postalCode: '25850-000',
      addressCountry: 'BR',
    },
    telephone: storeInfo.phone,
    email: storeInfo.email,
    url: 'https://www.pequentecalcados.com.br',
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '14:00',
      },
    ],
  };

  return (
    <>
      <Script
        id="footer-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <footer className="bg-[#00008B] border-t border-[#252525] text-gray-300 relative">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Sobre a loja */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Pé Quente Calçados</h3>
              <p className="text-sm mb-4">
                Sua loja de tênis, roupas e acessórios em Paraíba do Sul. 
                Os melhores produtos das principais marcas do mercado.
              </p>
              <div className="flex space-x-4">
                {storeInfo.instagram && (
                  <a
                    href={storeInfo.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#FF0000] transition-all duration-250 hover:scale-110"
                    aria-label="Instagram"
                  >
                    <Instagram size={24} />
                  </a>
                )}
                {storeInfo.facebook && (
                  <a
                    href={storeInfo.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#FF0000] transition-all duration-250 hover:scale-110"
                    aria-label="Facebook"
                  >
                    <Facebook size={24} />
                  </a>
                )}
              </div>
            </div>

            {/* Produtos */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Produtos</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/produtos?categoria=${category.slug}`}
                      className="text-sm hover:text-[#FF0000] transition"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/produtos"
                    className="text-sm hover:text-[#FF0000] transition"
                  >
                    Todos os Produtos
                  </Link>
                </li>
              </ul>
            </div>

            {/* Ajuda */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Ajuda</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/sobre" className="text-sm hover:text-[#FF0000] transition">
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link href="/contato" className="text-sm hover:text-[#FF0000] transition">
                    Fale Conosco
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm hover:text-[#FF0000] transition">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm hover:text-[#FF0000] transition">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contato e Newsletter */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Contato</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start space-x-3">
                  <MapPin size={20} className="text-[#FF0000] mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{storeInfo.address}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone size={20} className="text-[#FF0000] flex-shrink-0" />
                  <a
                    href={`tel:${storeInfo.phone}`}
                    className="text-sm hover:text-[#FF0000] transition"
                  >
                    {storeInfo.phone}
                  </a>
                </li>
                {storeInfo.email && (
                  <li className="flex items-center space-x-3">
                    <Mail size={20} className="text-[#FF0000] flex-shrink-0" />
                    <a
                      href={`mailto:${storeInfo.email}`}
                      className="text-sm hover:text-[#FF0000] transition"
                    >
                      {storeInfo.email}
                    </a>
                  </li>
                )}
                <li className="flex items-start space-x-3">
                  <Clock size={20} className="text-[#FF0000] mt-0.5 flex-shrink-0" />
                  <div className="text-sm space-y-1">
                    <div>{storeInfo.hours.weekdays}</div>
                    <div>{storeInfo.hours.saturday}</div>
                    <div>{storeInfo.hours.sunday}</div>
                  </div>
                </li>
              </ul>

              {/* Newsletter */}
              <div>
                <h4 className="text-white font-bold mb-2 text-sm">Newsletter</h4>
                {subscribed ? (
                  <p className="text-green-500 text-sm">Inscrito com sucesso!</p>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Seu e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1"
                    />
                    <Button type="submit" size="sm">
                      Inscrever
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Rodapé inferior */}
          <div className="border-t border-[#252525] mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} Pé Quente Calçados. Todos os direitos reservados.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Formas de Pagamento:</span>
                <span className="px-2 py-1 bg-[#1a1a1a] rounded">PIX</span>
                <span className="px-2 py-1 bg-[#1a1a1a] rounded">Cartão</span>
                <span className="px-2 py-1 bg-[#1a1a1a] rounded">Boleto</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nota de portfólio */}
        <div className="border-t border-[#1a1aff]/30 mt-8 pt-6">
          <div className="container mx-auto px-4">
            <p className="text-center text-gray-400 text-xs">
              Site desenvolvido por{' '}
              <a
                href="https://github.com/MyBoxStorage/PeQuente"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#FF0000] transition-colors duration-250 underline"
              >
                VibeCoding
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
