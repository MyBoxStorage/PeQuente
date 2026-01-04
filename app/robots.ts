import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.pequentecalcados.com.br';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/carrinho', '/minha-conta'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
