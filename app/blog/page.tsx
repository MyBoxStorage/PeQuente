import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Dicas, novidades e conteúdos sobre calçados, moda e esportes',
};

// Dados de exemplo para o blog - você pode substituir por dados reais
const blogPosts = [
  {
    id: '1',
    slug: 'como-escolher-o-tenis-ideal',
    title: 'Como Escolher o Tênis Ideal para Você',
    excerpt: 'Dicas importantes para encontrar o calçado perfeito que combina conforto, estilo e funcionalidade.',
    image: '/images/blog/tenis-ideal.jpg',
    date: '2024-01-15',
    category: 'Dicas',
  },
  {
    id: '2',
    slug: 'cuidados-com-seus-tenis',
    title: '5 Dicas para Manter seus Tênis Sempre Novos',
    excerpt: 'Aprenda a cuidar corretamente dos seus calçados e fazer com que durem muito mais tempo.',
    image: '/images/blog/cuidados-tenis.jpg',
    date: '2024-01-10',
    category: 'Cuidados',
  },
  {
    id: '3',
    slug: 'tendencias-2024',
    title: 'Tendências de Calçados para 2024',
    excerpt: 'Descubra as principais tendências de calçados que vão dominar este ano.',
    image: '/images/blog/tendencias.jpg',
    date: '2024-01-05',
    category: 'Tendências',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Blog</h1>
            <p className="text-gray-400 text-lg">
              Dicas, novidades e conteúdos sobre calçados, moda e esportes
            </p>
          </div>

          {blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">
                Em breve teremos conteúdo interessante para você!
              </p>
              <Link
                href="/produtos"
                className="inline-block bg-[#FF0000] hover:bg-[#FF0000]/90 text-white font-bold px-8 py-3 rounded-lg transition"
              >
                Ver Produtos
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#252525] hover:border-[#FF0000] transition-all duration-300 hover:shadow-lg"
                >
                  {/* Imagem do post */}
                  <div className="relative aspect-video bg-[#252525] overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      Sem imagem
                    </div>
                    {/* Se tiver imagem:
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    */}
                    {post.category && (
                      <div className="absolute top-4 left-4 bg-[#FF0000] text-white text-xs font-bold px-3 py-1 rounded">
                        {post.category}
                      </div>
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                      <Calendar size={16} />
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </time>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-[#FF0000] transition line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-[#FF0000] font-medium group-hover:gap-2 transition-all">
                      <span>Ler mais</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
