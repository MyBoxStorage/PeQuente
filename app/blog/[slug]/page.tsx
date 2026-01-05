import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowLeft } from 'lucide-react';

// Dados de exemplo - você pode substituir por uma fonte de dados real
const blogPosts: Record<string, {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  image?: string;
  date: string;
  category: string;
  author?: string;
}> = {
  'como-escolher-o-tenis-ideal': {
    id: '1',
    slug: 'como-escolher-o-tenis-ideal',
    title: 'Como Escolher o Tênis Ideal para Você',
    excerpt: 'Dicas importantes para encontrar o calçado perfeito que combina conforto, estilo e funcionalidade.',
    content: `
      <p>Escolher o tênis ideal pode fazer toda a diferença no seu dia a dia. Seja para praticar esportes, caminhar ou usar no trabalho, é importante considerar alguns fatores essenciais.</p>
      
      <h2>1. Tipo de Atividade</h2>
      <p>O primeiro passo é identificar para qual atividade você precisa do tênis. Tênis de corrida são diferentes de tênis de caminhada, e cada um tem características específicas para oferecer o melhor desempenho.</p>
      
      <h2>2. Tipo de Pisada</h2>
      <p>Conhecer seu tipo de pisada (neutra, pronada ou supinada) é fundamental para escolher um tênis que ofereça o suporte adequado e previna lesões.</p>
      
      <h2>3. Conforto e Ajuste</h2>
      <p>Experimente os tênis e certifique-se de que há espaço suficiente para os dedos, mas que o calcanhar fique firme. O conforto deve ser prioridade máxima.</p>
      
      <h2>4. Material e Durabilidade</h2>
      <p>Preste atenção à qualidade dos materiais. Tênis de marcas reconhecidas geralmente oferecem melhor durabilidade e tecnologia.</p>
      
      <p>Na Pé Quente Calçados, nossa equipe está sempre pronta para ajudá-lo a encontrar o tênis perfeito para suas necessidades!</p>
    `,
    date: '2024-01-15',
    category: 'Dicas',
    author: 'Equipe Pé Quente',
  },
  'cuidados-com-seus-tenis': {
    id: '2',
    slug: 'cuidados-com-seus-tenis',
    title: '5 Dicas para Manter seus Tênis Sempre Novos',
    excerpt: 'Aprenda a cuidar corretamente dos seus calçados e fazer com que durem muito mais tempo.',
    content: `
      <p>Com os cuidados certos, seus tênis podem durar muito mais tempo e sempre parecer novos. Confira nossas dicas:</p>
      
      <h2>1. Limpeza Regular</h2>
      <p>Limpe seus tênis regularmente com produtos específicos ou água e sabão neutro. Evite máquinas de lavar que podem danificar os materiais.</p>
      
      <h2>2. Secagem Natural</h2>
      <p>Nunca coloque tênis no sol direto ou próximo a fontes de calor. Deixe secar naturalmente em local arejado, preferencialmente com jornal dentro para manter o formato.</p>
      
      <h2>3. Rotação de Uso</h2>
      <p>Se possível, tenha mais de um par e alterne o uso. Isso permite que o tênis "descanse" e os materiais voltem ao formato original.</p>
      
      <h2>4. Armazenamento Correto</h2>
      <p>Guarde seus tênis em local seco e arejado, longe da luz direta do sol. Evite lugares úmidos que podem causar mofo.</p>
      
      <h2>5. Proteção Preventiva</h2>
      <p>Use produtos de proteção antes do primeiro uso, especialmente para tênis de couro ou materiais mais delicados.</p>
    `,
    date: '2024-01-10',
    category: 'Cuidados',
    author: 'Equipe Pé Quente',
  },
  'tendencias-2024': {
    id: '3',
    slug: 'tendencias-2024',
    title: 'Tendências de Calçados para 2024',
    excerpt: 'Descubra as principais tendências de calçados que vão dominar este ano.',
    content: `
      <p>O mundo dos calçados está sempre evoluindo, e 2024 traz novidades interessantes. Confira as principais tendências:</p>
      
      <h2>1. Sustentabilidade</h2>
      <p>Marcas estão investindo cada vez mais em materiais sustentáveis e processos de produção eco-friendly. Tênis feitos com materiais reciclados são destaque.</p>
      
      <h2>2. Tecnologia de Amortecimento</h2>
      <p>As tecnologias de amortecimento continuam evoluindo, oferecendo maior conforto e desempenho em atividades físicas.</p>
      
      <h2>3. Design Minimalista</h2>
      <p>O estilo clean e minimalista segue forte, com tênis versáteis que combinam com qualquer look.</p>
      
      <h2>4. Cores Vibrantes</h2>
      <p>Após anos de cores neutras, 2024 traz de volta cores vibrantes e estampas ousadas para quem quer se destacar.</p>
      
      <p>Na Pé Quente Calçados, você encontra todas essas tendências e muito mais!</p>
    `,
    date: '2024-01-05',
    category: 'Tendências',
    author: 'Equipe Pé Quente',
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    return {
      title: 'Post não encontrado',
    };
  }

  const blogUrl = `https://www.pequentecalcados.com.br/blog/${slug}`;
  const blogImage = post.image 
    ? post.image.startsWith('http')
      ? post.image
      : `https://www.pequentecalcados.com.br${post.image}`
    : 'https://www.pequentecalcados.com.br/images/logo.png';

  return {
    title: `${post.title} | Blog - Pé Quente Calçados`,
    description: post.excerpt,
    keywords: [post.title, 'blog', 'calçados', 'tênis', 'dicas', 'Paraíba do Sul', 'Pé Quente Calçados', ...(post.category ? [post.category] : [])],
    openGraph: {
      type: "article",
      url: blogUrl,
      siteName: "Pé Quente Calçados",
      title: `${post.title} | Blog - Pé Quente Calçados`,
      description: post.excerpt,
      images: [
        {
          url: blogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "pt_BR",
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      tags: post.category ? [post.category] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Blog - Pé Quente Calçados`,
      description: post.excerpt,
      images: [blogImage],
    },
    alternates: {
      canonical: blogUrl,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-gray-400">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-[#FF0000] transition">
                  Início
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/blog" className="hover:text-[#FF0000] transition">
                  Blog
                </Link>
              </li>
              <li>/</li>
              <li className="text-white">{post.title}</li>
            </ol>
          </nav>

          {/* Botão voltar */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#FF0000] hover:text-[#FF0000]/80 transition mb-8"
          >
            <ArrowLeft size={20} />
            Voltar para o Blog
          </Link>

          {/* Header do post */}
          <article className="bg-[#1a1a1a] rounded-lg border border-[#252525] overflow-hidden">
            {post.image && (
              <div className="relative aspect-video bg-[#252525]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="p-8">
              {/* Meta informações */}
              <div className="flex items-center gap-4 text-gray-400 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </time>
                </div>
                {post.category && (
                  <>
                    <span>•</span>
                    <span className="bg-[#FF0000] text-white px-3 py-1 rounded text-xs font-bold">
                      {post.category}
                    </span>
                  </>
                )}
                {post.author && (
                  <>
                    <span>•</span>
                    <span>{post.author}</span>
                  </>
                )}
              </div>

              {/* Título */}
              <h1 className="text-4xl font-bold text-white mb-6">
                {post.title}
              </h1>

              {/* Conteúdo */}
              <div
                className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </article>

          {/* Call to action */}
          <div className="mt-12 bg-gradient-to-r from-[#00008B] to-[#252525] rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Gostou do conteúdo?
            </h2>
            <p className="text-gray-200 mb-6">
              Confira nossa coleção completa de calçados e encontre o par ideal para você!
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
  );
}
