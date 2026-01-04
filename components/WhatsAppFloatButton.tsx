'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getStoreInfo } from '@/lib/api';

export default function WhatsAppFloatButton() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const storeInfo = getStoreInfo();

  // Ocultar no carrinho
  useEffect(() => {
    setIsVisible(pathname !== '/carrinho');
  }, [pathname]);

  // Extrair número do telefone (remover caracteres não numéricos)
  const phoneNumber = storeInfo.phone?.replace(/\D/g, '') || '';
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  if (!isVisible || !phoneNumber) {
    return null;
  }

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#FF0000] hover:bg-[#ff3333] text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-250 hover:scale-110 active:scale-95 group touch-friendly"
      style={{
        minWidth: '56px',
        minHeight: '56px',
        animation: 'pulse-subtle 3s ease-in-out infinite',
      }}
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle size={28} className="group-hover:scale-110 transition-transform duration-250" />
      {/* Pulse effect */}
      <span className="absolute inset-0 rounded-full bg-[#FF0000] animate-ping opacity-20 group-hover:opacity-0 transition-opacity duration-250" />
    </Link>
  );
}
