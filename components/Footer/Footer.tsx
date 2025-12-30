import Link from 'next/link';
import { Instagram, Facebook, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { getStoreInfo, getAllCategories } from '@/lib/api';

export default function Footer() {
  const storeInfo = getStoreInfo();
  const categories = getAllCategories();

  return (
    <footer className="bg-[#1a1a1a] border-t border-[#252525] text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                  className="text-gray-400 hover:text-[#FFD700] transition"
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
                  className="text-gray-400 hover:text-[#FFD700] transition"
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
                    href={`/categorias/${category.slug}`}
                    className="text-sm hover:text-[#FFD700] transition"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/produtos"
                  className="text-sm hover:text-[#FFD700] transition"
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
                <Link href="/sobre" className="text-sm hover:text-[#FFD700] transition">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-sm hover:text-[#FFD700] transition">
                  Fale Conosco
                </Link>
              </li>
              <li>
                <Link href="/trocas-devolucoes" className="text-sm hover:text-[#FFD700] transition">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidade" className="text-sm hover:text-[#FFD700] transition">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-[#FFD700] mt-1 flex-shrink-0" />
                <span>{storeInfo.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-[#FFD700] flex-shrink-0" />
                <a href={`tel:${storeInfo.phone}`} className="hover:text-[#FFD700] transition">
                  {storeInfo.phone}
                </a>
              </li>
              {storeInfo.email && (
                <li className="flex items-center space-x-3">
                  <Mail size={18} className="text-[#FFD700] flex-shrink-0" />
                  <a href={`mailto:${storeInfo.email}`} className="hover:text-[#FFD700] transition">
                    {storeInfo.email}
                  </a>
                </li>
              )}
              <li className="flex items-start space-x-3">
                <Clock size={18} className="text-[#FFD700] mt-1 flex-shrink-0" />
                <div>
                  <div>{storeInfo.hours.weekdays}</div>
                  <div>{storeInfo.hours.saturday}</div>
                  <div>{storeInfo.hours.sunday}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="border-t border-[#252525] mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Pé Quente Calçados. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <span className="text-gray-400">Formas de Pagamento:</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-[#252525] px-2 py-1 rounded">PIX</span>
                <span className="text-xs bg-[#252525] px-2 py-1 rounded">Cartão</span>
                <span className="text-xs bg-[#252525] px-2 py-1 rounded">Boleto</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
