'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, ShoppingBag, ChevronDown } from 'lucide-react';
import { getAllCategories } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import CartModal from '@/components/cart/CartModal';
import SearchBar from './SearchBar';

export default function HeaderPremium() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.getItemCount());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const categories = getAllCategories();
  const whatsappNumber = '2422632334';
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  // Filtrar categorias principais para o dropdown
  const mainCategories = categories.filter(cat => 
    ['tenis-masculino', 'tenis-feminino', 'acessorios'].includes(cat.slug)
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProductsDropdownOpen(false);
      }
    };

    if (productsDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [productsDropdownOpen]);

  // Limpar timeout ao desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleProductsMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setProductsDropdownOpen(true);
  };

  const handleProductsMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setProductsDropdownOpen(false);
    }, 300);
  };

  const isActive = (path: string) => {
    if (path === '/produtos') {
      return pathname?.startsWith('/produtos');
    }
    return pathname === path;
  };

  return (
    <>
      <header 
        className="fixed top-0 left-0 w-full z-50 bg-white shadow-md"
        role="banner"
      >
        {/* Banner promocional no topo */}
        <div className="bg-[#00008B] text-white text-center py-2 text-sm font-medium">
          <p>5% OFF NO PIX | PARCELAMENTO EM 12X | RETIRE NA LOJA EM PARAÍBA DO SUL</p>
        </div>

        {/* Header principal */}
        <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-6 max-w-7xl">
          {/* Menu hamburger mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-800 p-2 hover:bg-gray-100 rounded transition-colors"
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center group"
            aria-label="Logo Pé Quente Calçados"
            prefetch
          >
            <Image
              src="/logo-pe-quente.svg"
              alt="Pé Quente Calçados"
              width={150}
              height={48}
              className="h-10 md:h-12 w-auto object-contain"
              priority
              quality={90}
            />
          </Link>

          {/* Navegação desktop */}
          <nav 
            className="hidden md:flex items-center space-x-6 text-gray-800 font-semibold"
            role="navigation"
            aria-label="Menu principal"
          >
            <Link 
              href="/"
              className={`hover:text-[#FF0000] hover:underline transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2 rounded px-2 ${
                pathname === '/' ? 'text-[#FF0000]' : ''
              }`}
              prefetch
            >
              Home
            </Link>

            {/* Dropdown Produtos */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleProductsMouseEnter}
              onMouseLeave={handleProductsMouseLeave}
            >
              <button
                className={`flex items-center space-x-1 hover:text-[#FF0000] hover:underline transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2 rounded px-2 ${
                  pathname?.startsWith('/produtos') ? 'text-[#FF0000]' : ''
                }`}
                aria-expanded={productsDropdownOpen}
                aria-haspopup="true"
              >
                <span>Produtos</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-300 ${
                    productsDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {productsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 border border-gray-200 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                  {mainCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/produtos?categoria=${category.slug}`}
                      onClick={() => setProductsDropdownOpen(false)}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:text-[#FF0000] transition-colors duration-300 focus:outline-none focus:bg-gray-50 focus:text-[#FF0000]"
                    >
                      {category.name}
                    </Link>
                  ))}
                  <Link
                    href="/produtos"
                    onClick={() => setProductsDropdownOpen(false)}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:text-[#FF0000] transition-colors duration-300 font-medium border-t border-gray-200 mt-2 pt-2 focus:outline-none focus:bg-gray-50 focus:text-[#FF0000]"
                  >
                    Ver Todos
                  </Link>
                </div>
              )}
            </div>

            <Link 
              href="/produtos"
              className={`hover:text-[#FF0000] hover:underline transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2 rounded px-2 ${
                pathname?.startsWith('/produtos') && !pathname?.includes('categoria') ? 'text-[#FF0000]' : ''
              }`}
              prefetch
            >
              Marcas
            </Link>

            <Link 
              href="/produtos?promocoes=true"
              className={`hover:text-[#FF0000] hover:underline transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2 rounded px-2 ${
                pathname?.includes('promocoes') ? 'text-[#FF0000]' : ''
              }`}
              prefetch
            >
              Promoções
            </Link>

            <Link 
              href="/provador-virtual"
              className={`hover:text-[#FF0000] hover:underline transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2 rounded px-2 ${
                pathname === '/provador-virtual' ? 'text-[#FF0000]' : ''
              }`}
              prefetch
            >
              Provador Virtual
            </Link>

            <Link 
              href="/contato"
              className={`hover:text-[#FF0000] hover:underline transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2 rounded px-2 ${
                pathname === '/contato' ? 'text-[#FF0000]' : ''
              }`}
              prefetch
            >
              Contato
            </Link>
          </nav>

          {/* Barra de busca e ações */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Barra de busca desktop */}
            <div className="hidden lg:flex items-center w-64">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Busque por tênis..."
                  className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                  onFocus={() => setSearchOpen(true)}
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FF0000] transition-colors p-1"
                  aria-label="Buscar"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Ícone de busca mobile */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden text-gray-800 hover:text-[#FF0000] transition-colors p-2"
              aria-label="Buscar"
            >
              <Search size={22} />
            </button>

            {/* Ícone WhatsApp */}
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-700 transition-colors p-2"
              aria-label="Falar no WhatsApp"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </Link>

            {/* Carrinho */}
            <button
              onClick={() => setCartOpen(true)}
              className="text-gray-800 hover:text-[#FF0000] transition-colors p-2 relative"
              aria-label="Carrinho"
            >
              <ShoppingBag size={22} />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF0000] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold z-10">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="container mx-auto px-4 py-4 space-y-2" role="navigation" aria-label="Menu mobile">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 px-4 rounded hover:bg-gray-50 hover:text-[#FF0000] transition-colors ${
                  pathname === '/' ? 'text-[#FF0000] font-semibold' : 'text-gray-800'
                }`}
              >
                Home
              </Link>
              <Link
                href="/produtos"
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 px-4 rounded hover:bg-gray-50 hover:text-[#FF0000] transition-colors ${
                  pathname?.startsWith('/produtos') && !pathname?.includes('categoria') ? 'text-[#FF0000] font-semibold' : 'text-gray-800'
                }`}
              >
                Produtos
              </Link>
              <Link
                href="/produtos"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-4 rounded hover:bg-gray-50 hover:text-[#FF0000] transition-colors text-gray-800"
              >
                Marcas
              </Link>
              <Link
                href="/produtos?promocoes=true"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-4 rounded hover:bg-gray-50 hover:text-[#FF0000] transition-colors text-gray-800"
              >
                Promoções
              </Link>
              <Link
                href="/provador-virtual"
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 px-4 rounded hover:bg-gray-50 hover:text-[#FF0000] transition-colors ${
                  pathname === '/provador-virtual' ? 'text-[#FF0000] font-semibold' : 'text-gray-800'
                }`}
              >
                Provador Virtual
              </Link>
              <Link
                href="/contato"
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 px-4 rounded hover:bg-gray-50 hover:text-[#FF0000] transition-colors ${
                  pathname === '/contato' ? 'text-[#FF0000] font-semibold' : 'text-gray-800'
                }`}
              >
                Contato
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* SearchBar Modal */}
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}

      {/* Cart Modal */}
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Espaçamento para compensar header fixo */}
      <div className="h-[73px] md:h-[81px]" aria-hidden="true" />
    </>
  );
}
