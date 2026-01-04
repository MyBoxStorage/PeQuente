/**
 * Utilitários para otimização de imagens
 * Geração de blur placeholder, lazy loading, etc.
 */

/**
 * Gera um SVG placeholder blur (base64) para next/image
 * Útil para lazy loading com blur-up effect
 */
export const generateBlurPlaceholder = (
  width: number = 400,
  height: number = 400,
  color: string = '#1a1a1a'
): string => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `;
  
  const base64 = typeof window !== 'undefined' 
    ? btoa(svg)
    : Buffer.from(svg).toString('base64');
    
  return `data:image/svg+xml;base64,${base64}`;
};

/**
 * Placeholder padrão para produtos (aspect square)
 */
export const PRODUCT_PLACEHOLDER = generateBlurPlaceholder(400, 400, '#1a1a1a');

/**
 * Placeholder para banners (aspect ratio 16:9)
 */
export const BANNER_PLACEHOLDER = generateBlurPlaceholder(1200, 675, '#0a0a0a');

/**
 * Configuração padrão para next/image com otimização
 */
export const getImageConfig = (type: 'product' | 'banner' | 'thumbnail' = 'product') => {
  const configs = {
    product: {
      placeholder: 'blur' as const,
      blurDataURL: PRODUCT_PLACEHOLDER,
      quality: 85,
      loading: 'lazy' as const,
    },
    banner: {
      placeholder: 'blur' as const,
      blurDataURL: BANNER_PLACEHOLDER,
      quality: 90,
      loading: 'eager' as const, // Banners acima da dobra
    },
    thumbnail: {
      placeholder: 'blur' as const,
      blurDataURL: PRODUCT_PLACEHOLDER,
      quality: 75,
      loading: 'lazy' as const,
    },
  };

  return configs[type];
};
