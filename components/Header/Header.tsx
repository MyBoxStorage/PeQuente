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

          {/* Logo - usando apenas logo escrita */}
          <Link href="/" className="flex items-center group" prefetch>
            {/* Logo escrita "Pé Quente" - Mobile */}
            <div className="relative w-[180px] h-[50px] flex items-center lg:hidden">
              <Image
                src="/images/logo-escrita-mobile.png"
                alt="Pé Quente Calçados"
                fill
                className="object-contain opacity-100"
                style={{ imageRendering: 'crisp-edges' }}
                priority
                quality={100}
                sizes="180px"
              />
            </div>
            {/* Logo escrita "Pé Quente" - Desktop */}
            <div className="relative w-[220px] h-[60px] flex items-center hidden lg:flex">
              <Image
                src="/images/logo-escrita-desktop.png"
                alt="Pé Quente Calçados"
                fill
                className="object-contain opacity-100"
                style={{ imageRendering: 'crisp-edges' }}
                priority
                quality={100}
                sizes="220px"
              />
            </div>
          </Link>

          {/* Navegação desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <MegaMenu />
            <Link
              href="/produtos"
              className={`nav-link-creative ${isActive('/produtos') ? 'active' : ''} text-white px-4 py-2`}
              prefetch
            >
              Lançamentos
            </Link>
            <Link
              href="/sobre"
              className={`nav-link-creative ${isActive('/sobre') ? 'active' : ''} text-white px-4 py-2`}
              prefetch
            >
              Sobre
            </Link>
            <Link
              href="/faq"
              className={`nav-link-creative ${isActive('/faq') ? 'active' : ''} text-white px-4 py-2`}
              prefetch
            >
              FAQ
            </Link>
            <Link
              href="/blog"
              className={`nav-link-creative ${isActive('/blog') ? 'active' : ''} text-white px-4 py-2`}
              prefetch
            >
              Blog
            </Link>
          </nav>

          {/* Ações do usuário */}
          <div className="flex items-center space-x-4 relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="icon-action-button icon-red"
              aria-label="Buscar"
            >
              <Search size={22} />
            </button>
            {searchOpen && (
              <div className="absolute top-full right-0 mt-2 z-50">
                <SearchBar onClose={() => setSearchOpen(false)} />
              </div>
            )}
            <Link
              href="/minha-conta"
              className="icon-action-button icon-blue hidden sm:flex"
              aria-label="Conta"
              prefetch
            >
              <User size={22} />
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className="icon-action-button icon-yellow relative"
              aria-label="Carrinho"
            >
              <ShoppingBag size={22} />
              {/* Badge do carrinho */}
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF0000] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold z-10">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && <MobileMenu onClose={() => setMobileMenuOpen(false)} />}

      {/* Cart Modal */}
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
