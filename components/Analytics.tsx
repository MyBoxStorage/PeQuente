'use client';

import Script from 'next/script';
import { useEffect } from 'react';

/**
 * Componente para Google Analytics
 * Configure NEXT_PUBLIC_GA_MEASUREMENT_ID no .env.local
 * Exemplo: NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 */
export default function Analytics() {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    // Console log para depuração
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] GA Measurement ID:', gaMeasurementId || 'Não configurado');
    }
  }, [gaMeasurementId]);

  if (!gaMeasurementId) {
    // Em desenvolvimento, apenas log
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Google Analytics não configurado. Adicione NEXT_PUBLIC_GA_MEASUREMENT_ID no .env.local');
    }
    return null;
  }

  return (
    <>
      {/* Google Analytics - gtag.js */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
