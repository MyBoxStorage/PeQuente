'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, MessageCircle } from 'lucide-react';
import { getStoreInfo } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function VisiteNossaLoja() {
  const storeInfo = getStoreInfo();

  // Extrair número do telefone (remover caracteres não numéricos)
  const phoneNumber = storeInfo.phone?.replace(/\D/g, '') || '';
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <section className="py-16 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 tracking-[0.05em]">
            Visite Nossa Loja
          </h2>
          <div className="w-24 h-0.5 bg-[#FF0000] mx-auto mb-4" />
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Venha nos conhecer pessoalmente em Paraíba do Sul
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informações da Loja */}
          <div className="space-y-6">
            <div className="bg-[#2d2d2d] rounded-lg p-6 border border-[#353535]">
              <div className="space-y-4">
                {/* Endereço */}
                <div className="flex items-start gap-4">
                  <MapPin className="text-[#FF0000] mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Endereço</h3>
                    <p className="text-gray-400 text-sm">{storeInfo.address}</p>
                  </div>
                </div>

                {/* Horários */}
                <div className="flex items-start gap-4 pt-4 border-t border-[#353535]">
                  <Clock className="text-[#FF0000] mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="text-white font-semibold mb-2">Horários de Funcionamento</h3>
                    <div className="space-y-1 text-gray-400 text-sm">
                      <p>{storeInfo.hours.weekdays}</p>
                      <p>{storeInfo.hours.saturday}</p>
                      <p className="text-gray-500">{storeInfo.hours.sunday}</p>
                    </div>
                  </div>
                </div>

                {/* Telefone */}
                {storeInfo.phone && (
                  <div className="flex items-center gap-4 pt-4 border-t border-[#353535]">
                    <div className="text-[#FF0000] text-lg font-semibold">
                      {storeInfo.phone}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Foto da Fachada e Botão WhatsApp */}
          <div className="space-y-6">
            {/* Foto da Fachada (placeholder) */}
            <div className="relative rounded-lg overflow-hidden border border-[#353535] bg-[#2d2d2d] aspect-[4/3]">
              {/* Placeholder - pode ser substituído por foto real */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#252525] to-[#1a1a1a]">
                <div className="text-center">
                  <MapPin className="text-[#FF0000] mx-auto mb-4" size={48} />
                  <p className="text-gray-400 text-sm">Foto da fachada</p>
                </div>
              </div>
              {/* Se tiver foto real, descomentar:
              <Image
                src="/images/loja-fachada.jpg"
                alt="Fachada da Pé Quente Calçados"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              */}
            </div>

            {/* Card de Destaque com Botão WhatsApp */}
            <div className="bg-gradient-to-br from-[#2d2d2d] to-[#252525] rounded-lg p-8 border border-[#353535] text-center">
              <MessageCircle className="text-[#FF0000] mx-auto mb-4" size={48} />
              <h3 className="text-white font-bold text-xl mb-2">
                Fale Conosco no WhatsApp
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Tire suas dúvidas, confirme disponibilidade de produtos ou agende sua visita
              </p>
              {phoneNumber && (
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Link
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={20} />
                    Falar no WhatsApp
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
