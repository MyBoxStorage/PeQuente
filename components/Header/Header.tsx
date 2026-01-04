'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, User, Heart, ShoppingBag } from 'lucide-react';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
import MegaMenu from './MegaMenu';
import CartModal from '@/components/cart/CartModal';
import { useCartStore } from '@/store/cartStore';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/produtos') {
      return pathname?.startsWith('/produtos');
    }
    return pathname === path;
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-[#0a0a0a] border-b transition-all duration-250 ${
        scrolled ? 'border-[#FF0000]' : 'border-[#252525]'
      }`}
    >
      {/* Banner promocional no topo - removido mensagem de frete */}
      <div className="bg-[#00008B] text-white text-center py-2 text-sm">
        <p>Sempre um passo à frente</p>
      </div>

      {/* Header principal */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Menu hamburguer mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-3 touch-friendly"
            aria-label="Menu"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo - usando logo original PNG e logo escrita */}
          <Link href="/" className="flex items-center group" prefetch>
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Logo quadrada (P e Q) */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0 flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="Pé Quente Calçados"
                  width={72}
                  height={72}
                  className="object-contain w-full h-full"
                  style={{ imageRendering: 'crisp-edges' }}
                  priority
                  quality={100}
                />
              </div>
              {/* Logo escrita "Pé Quente" */}
              <div className="relative h-7 sm:h-8 md:h-9 flex items-center">
                <Image
                  src="/images/logo-escrita.png"
                  alt="Pé Quente"
                  width={180}
                  height={36}
                  className="object-contain h-full w-auto opacity-100"
                  style={{ imageRendering: 'crisp-edges' }}
                  priority
                  quality={100}
                />
              </div>
            </div>
          </Link>

          {/* Navegação desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <MegaMenu />
            <Link
              href="/produtos?categoria=tenis"
              className={`text-white hover:text-[#FF0000] transition-colors duration-250 relative ${
                isActive('/produtos?categoria=tenis')
                  ? 'text-[#FF0000]'
                  : ''
              }`}
              prefetch
            >
              Lançamentos
              {isActive('/produtos?categoria=tenis') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF0000] -mb-2" />
              )}
            </Link>
            <Link
              href="/sobre"
              className={`text-white hover:text-[#FF0000] transition-colors duration-250 relative ${
                isActive('/sobre') ? 'text-[#FF0000]' : ''
              }`}
              prefetch
            >
              Sobre
              {isActive('/sobre') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF0000] -mb-2" />
              )}
            </Link>
            <Link
              href="/faq"
              className={`text-white hover:text-[#FF0000] transition-colors duration-250 relative ${
                isActive('/faq') ? 'text-[#FF0000]' : ''
              }`}
              prefetch
            >
              FAQ
              {isActive('/faq') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF0000] -mb-2" />
              )}
            </Link>
            <Link
              href="/blog"
              className={`text-white hover:text-[#FF0000] transition-colors duration-250 relative ${
                isActive('/blog') ? 'text-[#FF0000]' : ''
              }`}
              prefetch
            >
              Blog
              {isActive('/blog') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF0000] -mb-2" />
              )}
            </Link>
          </nav>

          {/* Ações do usuário */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white hover:text-[#FF0000] transition-all duration-250 p-2 hover:scale-110 active:scale-95"
              aria-label="Buscar"
            >
              <Search size={22} />
            </button>
            <Link
              href="/minha-conta"
              className="text-white hover:text-[#FF0000] transition-all duration-250 p-2 hidden sm:block hover:scale-110 active:scale-95"
              aria-label="Conta"
              prefetch
            >
              <User size={22} />
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className="text-white hover:text-[#FF0000] transition-all duration-250 p-2 relative hover:scale-110 active:scale-95"
              aria-label="Carrinho"
            >
              <ShoppingBag size={22} />
              {/* Badge do carrinho - CSS puro (otimizado) */}
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF0000] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Barra de busca expandida */}
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}

      {/* Menu mobile */}
      {mobileMenuOpen && <MobileMenu onClose={() => setMobileMenuOpen(false)} />}

      {/* Cart Modal */}
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
