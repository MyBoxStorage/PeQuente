import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import { getStoreInfo } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Sobre Nós',
  description: 'Conheça a história da Pé Quente Calçados, sua loja de tênis e acessórios em Paraíba do Sul.',
  openGraph: {
    type: "website",
    url: "https://www.pequentecalcados.com.br/sobre",
    siteName: "Pé Quente Calçados",
    title: "Sobre Nós - Pé Quente Calçados",
    description: "Conheça a história da Pé Quente Calçados, sua loja de tênis e acessórios em Paraíba do Sul.",
    images: [
      {
        url: "https://www.pequentecalcados.com.br/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Sobre a Pé Quente Calçados",
      },
    ],
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sobre Nós - Pé Quente Calçados",
    description: "Conheça a história da Pé Quente Calçados, sua loja de tênis e acessórios em Paraíba do Sul.",
    images: ["https://www.pequentecalcados.com.br/images/logo.png"],
  },
};

export default function SobrePage() {
  const storeInfo = getStoreInfo();

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">Sobre a Pé Quente Calçados</h1>
          
          <div className="prose prose-invert max-w-none">
            <div className="bg-[#1a1a1a] rounded-lg p-8 mb-8 border border-[#252525]">
              <h2 className="text-2xl font-bold text-white mb-4">Nossa História</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                A Pé Quente Calçados é uma loja tradicional em Paraíba do Sul, dedicada a oferecer os melhores 
                produtos das principais marcas do mercado. Com anos de experiência no ramo de calçados, nossa missão 
                é proporcionar qualidade, conforto e estilo para nossos clientes.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Sempre um passo à frente, buscamos as últimas tendências e novidades do mundo dos calçados, 
                trazendo para nossa cidade produtos de marcas renomadas como Nike, Adidas, Mizuno, Puma e muitas outras.
              </p>
            </div>

            <div className="bg-[#1a1a1a] rounded-lg p-8 mb-8 border border-[#252525]">
              <h2 className="text-2xl font-bold text-white mb-4">Nossa Missão</h2>
              <p className="text-gray-300 leading-relaxed">
                Oferecer produtos de qualidade, com excelente atendimento e preços justos, mantendo sempre 
                o foco na satisfação do cliente e no respeito ao nosso compromisso com a comunidade de Paraíba do Sul.
              </p>
            </div>

            <div className="bg-[#1a1a1a] rounded-lg p-8 mb-8 border border-[#252525]">
              <h2 className="text-2xl font-bold text-white mb-6">Nossa Localização</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <MapPin className="text-[#FF0000] mt-1 flex-shrink-0" size={24} />
                  <div>
                    <p className="text-white font-medium mb-1">Endereço</p>
                    <p className="text-gray-300">{storeInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="text-[#FF0000] mt-1 flex-shrink-0" size={24} />
                  <div>
                    <p className="text-white font-medium mb-1">Horário de Funcionamento</p>
                    <p className="text-gray-300">{storeInfo.hours.weekdays}</p>
                    <p className="text-gray-300">{storeInfo.hours.saturday}</p>
                    <p className="text-gray-300">{storeInfo.hours.sunday}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="text-[#FF0000] mt-1 flex-shrink-0" size={24} />
                  <div>
                    <p className="text-white font-medium mb-1">Telefone</p>
                    <a href={`tel:${storeInfo.phone}`} className="text-gray-300 hover:text-[#FF0000] transition">
                      {storeInfo.phone}
                    </a>
                  </div>
                </div>
                {storeInfo.email && (
                  <div className="flex items-start space-x-4">
                    <Mail className="text-[#FF0000] mt-1 flex-shrink-0" size={24} />
                    <div>
                      <p className="text-white font-medium mb-1">E-mail</p>
                      <a href={`mailto:${storeInfo.email}`} className="text-gray-300 hover:text-[#FF0000] transition">
                        {storeInfo.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#00008B] to-[#252525] rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Venha nos Visitar!</h2>
              <p className="text-gray-200 mb-6">
                Estamos prontos para atendê-lo com o melhor em calçados, roupas e acessórios.
              </p>
              <Link
                href="/produtos"
                className="inline-block bg-[#FF0000] hover:bg-[#FF0000]/90 text-white font-bold px-8 py-3 rounded-lg transition"
              >
                Ver Produtos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
