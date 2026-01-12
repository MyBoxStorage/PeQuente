'use client';

import { useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { getStoreInfo } from '@/lib/api';

export default function Footer() {
  const storeInfo = getStoreInfo();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Validação simples de email
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    if (!email) {
      setEmailError('Por favor, insira um e-mail');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Por favor, insira um e-mail válido');
      return;
    }

    // Mock sendEmail - aqui você integraria com sua API
    console.log('Newsletter subscription:', email);
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

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
      <footer className="bg-gray-800 text-white p-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Coluna 1: Links Úteis */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Links Úteis</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-300 hover:text-white hover:underline transition-colors duration-200"
                    aria-label="Página inicial"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/produtos"
                    className="text-gray-300 hover:text-white hover:underline transition-colors duration-200"
                    aria-label="Ver todos os produtos"
                  >
                    Produtos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/marcas"
                    className="text-gray-300 hover:text-white hover:underline transition-colors duration-200"
                    aria-label="Ver marcas disponíveis"
                  >
                    Marcas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/promocoes"
                    className="text-gray-300 hover:text-white hover:underline transition-colors duration-200"
                    aria-label="Ver promoções"
                  >
                    Promoções
                  </Link>
                </li>
              </ul>
            </div>

            {/* Coluna 2: Contato */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Contato</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt text-gray-400 mr-3 mt-1" aria-hidden="true"></i>
                  <span className="text-gray-300 text-sm">
                    Praça Garcia 136/140<br />
                    Paraíba do Sul, RJ
                  </span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-phone text-gray-400 mr-3" aria-hidden="true"></i>
                  <a
                    href={`tel:${storeInfo.phone}`}
                    className="text-gray-300 hover:text-white hover:underline transition-colors duration-200 text-sm"
                    aria-label={`Ligar para ${storeInfo.phone}`}
                  >
                    {storeInfo.phone}
                  </a>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope text-gray-400 mr-3" aria-hidden="true"></i>
                  <a
                    href={`mailto:${storeInfo.email}`}
                    className="text-gray-300 hover:text-white hover:underline transition-colors duration-200 text-sm"
                    aria-label={`Enviar e-mail para ${storeInfo.email}`}
                  >
                    {storeInfo.email}
                  </a>
                </li>
                <li className="flex items-center">
                  <i className="fab fa-whatsapp text-green-500 mr-3 text-lg" aria-hidden="true"></i>
                  <a
                    href="https://wa.me/552422632334"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white hover:underline transition-colors duration-200 text-sm"
                    aria-label="Entrar em contato via WhatsApp"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>

            {/* Coluna 3: Pagamentos */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Pagamentos</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <i className="fas fa-qrcode text-gray-400 mr-3" aria-hidden="true"></i>
                  <span className="text-gray-300 text-sm">
                    PIX <span className="text-green-400 font-semibold">5% OFF</span>
                  </span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-credit-card text-gray-400 mr-3" aria-hidden="true"></i>
                  <span className="text-gray-300 text-sm">Cartão 12x</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-store text-gray-400 mr-3" aria-hidden="true"></i>
                  <span className="text-gray-300 text-sm">Retirada na Loja</span>
                </li>
              </ul>
            </div>

            {/* Coluna 4: Newsletter */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Newsletter</h3>
              {subscribed ? (
                <p className="text-green-400 text-sm mb-4">
                  <i className="fas fa-check-circle mr-2" aria-hidden="true"></i>
                  Inscrito com sucesso!
                </p>
              ) : (
                <form
                  onSubmit={handleNewsletterSubmit}
                  aria-label="Inscreva-se na newsletter"
                  className="space-y-2"
                >
                  <div>
                    <input
                      type="email"
                      placeholder="Seu e-mail"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError('');
                      }}
                      className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      aria-label="E-mail para newsletter"
                      aria-invalid={emailError ? 'true' : 'false'}
                      aria-describedby={emailError ? 'email-error' : undefined}
                    />
                    {emailError && (
                      <p id="email-error" className="text-red-400 text-xs mt-1" role="alert">
                        {emailError}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
                    aria-label="Inscrever-se na newsletter"
                  >
                    Inscrever
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Rodapé inferior */}
          <div className="border-t border-gray-700 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} Pé Quente Calçados. Todos os direitos reservados.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Formas de Pagamento:</span>
                <span className="px-2 py-1 bg-gray-700 rounded">PIX</span>
                <span className="px-2 py-1 bg-gray-700 rounded">Cartão</span>
                <span className="px-2 py-1 bg-gray-700 rounded">Boleto</span>
              </div>
            </div>
          </div>

          {/* Nota de portfólio - discreto */}
          <div className="border-t border-gray-700 mt-6 pt-6">
            <div className="container mx-auto px-4">
              <p className="text-center text-gray-500 text-xs">
                Site desenvolvido por{' '}
                <a
                  href="https://github.com/MyBoxStorage/PeQuente"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-400 transition-colors duration-250 underline"
                >
                  VibeCoding
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
