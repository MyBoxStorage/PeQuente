'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, Search, User, ShoppingBag } from 'lucide-react';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
import MegaMenu from './MegaMenu';
import CartModal from '@/components/cart/CartModal';
import { useCartStore } from '@/store/cartStore';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.getItemCount());

  const isActive = (path: string) => {
    if (path === '/produtos') {
      return pathname?.startsWith('/produtos');
    }
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800 shadow-lg">
      {/* Banner promocional no topo */}
      <div className="bg-[#00008B] text-white text-center py-2 text-sm font-medium">
        <p>5% OFF NO PIX | PARCELAMENTO EM 12X | RETIRE NA LOJA EM PARAÍBA DO SUL</p>
      </div>

      {/* Header principal */}
      <div className="container mx-auto flex items-center justify-between py-4 px-6 max-w-7xl">
        {/* Menu hamburguer mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-white p-2 touch-friendly"
          aria-label="Menu"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo SVG */}
        <Link href="/" className="flex items-center group" prefetch>
          <img 
            src="/logo-pe-quente.svg" 
            alt="Pé Quente Calçados" 
            className="h-14 md:h-20 w-auto object-contain drop-shadow-md bg-transparent" 
            style={{ background: 'transparent' }}
          />
        </Link>

        {/* Navegação desktop */}
        <nav className="hidden lg:flex items-center space-x-8 text-white font-semibold">
          <MegaMenu />
          <Link 
            href="/produtos" 
            className={`hover:text-[#00008B] transition duration-300 ${isActive('/produtos') ? 'text-[#00008B]' : ''}`}
            prefetch
          >
            Lançamentos
          </Link>
          <Link 
            href="/sobre" 
            className={`hover:text-[#00008B] transition duration-300 ${isActive('/sobre') ? 'text-[#00008B]' : ''}`}
            prefetch
          >
            Sobre
          </Link>
          <Link 
            href="/faq" 
            className={`hover:text-[#00008B] transition duration-300 ${isActive('/faq') ? 'text-[#00008B]' : ''}`}
            prefetch
          >
            FAQ
          </Link>
          <Link 
            href="/blog" 
            className={`hover:text-[#00008B] transition duration-300 ${isActive('/blog') ? 'text-[#00008B]' : ''}`}
            prefetch
          >
            Blog
          </Link>
        </nav>

        {/* Ações do usuário */}
        <div className="flex items-center space-x-4 relative">
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white hover:text-[#00008B] transition-colors duration-300 p-2"
              aria-label="Buscar"
            >
              <Search size={22} />
            </button>
            {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
          </div>
          
          <Link
            href="/minha-conta"
            className="text-white hover:text-[#00008B] transition-colors duration-300 p-2 hidden sm:flex"
            aria-label="Conta"
            prefetch
          >
            <User size={22} />
          </Link>
          
          <button
            onClick={() => setCartOpen(true)}
            className="text-white hover:text-[#00008B] transition-colors duration-300 p-2 relative"
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

      {/* Menu mobile */}
      {mobileMenuOpen && <MobileMenu onClose={() => setMobileMenuOpen(false)} />}

      {/* Cart Modal */}
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
