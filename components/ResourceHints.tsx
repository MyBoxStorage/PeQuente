'use client';

import { useEffect } from 'react';

/**
 * Componente para adicionar resource hints (preconnect/dns-prefetch) no head
 * Necessário porque Next.js App Router não permite <head> diretamente no layout
 */
export default function ResourceHints() {
  useEffect(() => {
    // Adicionar preconnects para melhorar performance
    const preconnects = [
      { rel: 'preconnect', href: 'https://static.netshoes.com.br' },
      { rel: 'dns-prefetch', href: 'https://static.netshoes.com.br' },
      { rel: 'preconnect', href: 'https://wa.me' },
      { rel: 'dns-prefetch', href: 'https://wa.me' },
      { rel: 'preconnect', href: 'https://cdnjs.cloudflare.com' },
      { rel: 'dns-prefetch', href: 'https://cdnjs.cloudflare.com' },
      // Model-viewer (Google) - pré-conectar para carregamento rápido
      { rel: 'preconnect', href: 'https://ajax.googleapis.com' },
      { rel: 'dns-prefetch', href: 'https://ajax.googleapis.com' },
    ];
    
    // Pré-carregar script do model-viewer para 3D instantâneo
    const modelViewerPreload = document.querySelector('link[href*="model-viewer"]');
    if (!modelViewerPreload) {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'modulepreload';
      preloadLink.href = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js';
      document.head.appendChild(preloadLink);
    }

    preconnects.forEach(({ rel, href }) => {
      // Verificar se já existe
      const existing = document.querySelector(`link[rel="${rel}"][href="${href}"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        document.head.appendChild(link);
      }
    });

    // Adicionar Font Awesome
    const fontAwesomeExists = document.querySelector('link[href*="font-awesome"]');
    if (!fontAwesomeExists) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
      link.integrity = 'sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==';
      link.crossOrigin = 'anonymous';
      link.referrerPolicy = 'no-referrer';
      document.head.appendChild(link);
    }
  }, []);

  return null;
}
