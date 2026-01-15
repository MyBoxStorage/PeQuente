'use client';

import { useState } from 'react';

interface StreetViewProps {
  panoId?: string;
  heading?: number;
  pitch?: number;
  zoom?: number;
  className?: string;
}

export default function StreetView({
  panoId = 'oEDrOqA1vb5IL6aVQV2Ogg',
  heading = 81.26,
  pitch = 7.76,
  zoom = 0.7820865974627469,
  className = '',
}: StreetViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Gerar URL do Google Maps Embed para Street View
  // Formato: !4v[timestamp]!6m8!1m7!1s[panoId]!2m2!1d[lat]!2d[lng]!3f[heading]!4f[pitch]!5f[zoom]
  const embedUrl = `https://www.google.com/maps/embed?pb=!4v${Date.now()}!6m8!1m7!1s${panoId}!2m2!1d-22.1629671!2d-43.2917261!3f${heading}!4f${pitch}!5f${zoom}`;

  return (
    <div 
      className={`relative w-full h-full rounded-lg overflow-hidden ${className}`}
      style={{ minHeight: '400px' }}
    >
      {/* Loading state */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#2d2d2d] z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Carregando Street View...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#2d2d2d] z-10">
          <div className="text-center p-4">
            <p className="text-gray-400 text-sm mb-2">Não foi possível carregar o Street View</p>
            <a 
              href="https://maps.google.com/?q=Pé+Quente+Sapataria+Paraíba+do+Sul"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:text-red-400 text-sm underline"
            >
              Abrir no Google Maps →
            </a>
          </div>
        </div>
      )}

      {/* Google Maps Embed iframe */}
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: '400px' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Street View da fachada da loja Pé Quente Calçados"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        className={isLoading || hasError ? 'invisible' : 'visible'}
      />
    </div>
  );
}
