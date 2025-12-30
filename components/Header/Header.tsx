'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, User, Heart, ShoppingBag } from 'lucide-react';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-[#252525]">
      {/* Banner promocional no topo */}
      <div className="bg-[#1E3A8A] text-white text-center py-2 text-sm">
        <p>🎉 Frete Grátis para Paraíba do Sul • Ganhe 5% OFF no PIX</p>
      </div>

      {/* Header principal */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Menu hamburguer mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="bg-[#FFD700] w-12 h-12 rounded flex items-center justify-center text-[#DC143C] font-bold text-xl">
                PQ
              </div>
              <span className="ml-2 text-white font-bold text-xl hidden sm:block">
                Pé Quente
              </span>
            </div>
          </Link>

          {/* Navegação desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/produtos" className="text-white hover:text-[#FFD700] transition">
              Produtos
            </Link>
            <Link href="/categorias/tenis-masculino" className="text-white hover:text-[#FFD700] transition">
              Tênis
            </Link>
            <Link href="/categorias/chinelos-e-sandalias" className="text-white hover:text-[#FFD700] transition">
              Chinelos
            </Link>
            <Link href="/sobre" className="text-white hover:text-[#FFD700] transition">
              Sobre
            </Link>
            <Link href="/contato" className="text-white hover:text-[#FFD700] transition">
              Contato
            </Link>
          </nav>

          {/* Ações do usuário */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white hover:text-[#FFD700] transition p-2"
              aria-label="Buscar"
            >
              <Search size={22} />
            </button>
            <Link
              href="/account"
              className="text-white hover:text-[#FFD700] transition p-2 hidden sm:block"
              aria-label="Conta"
            >
              <User size={22} />
            </Link>
            <Link
              href="/wishlist"
              className="text-white hover:text-[#FFD700] transition p-2"
              aria-label="Favoritos"
            >
              <Heart size={22} />
            </Link>
            <Link
              href="/cart"
              className="text-white hover:text-[#FFD700] transition p-2 relative"
              aria-label="Carrinho"
            >
              <ShoppingBag size={22} />
              {/* Badge do carrinho */}
              <span className="absolute -top-1 -right-1 bg-[#DC143C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Barra de busca expandida */}
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}

      {/* Menu mobile */}
      {mobileMenuOpen && <MobileMenu onClose={() => setMobileMenuOpen(false)} />}
    </header>
  );
}
