'use client';

import { useEffect, useRef } from 'react';

interface StreetViewProps {
  latitude?: number;
  longitude?: number;
  panoId?: string; // ID do panorama específico
  heading?: number;
  pitch?: number;
  zoom?: number;
  className?: string;
}

export default function StreetView({
  latitude,
  longitude,
  panoId,
  heading = 0,
  pitch = 0,
  zoom = 1,
  className = '',
}: StreetViewProps) {
  const panoramaRef = useRef<HTMLDivElement>(null);
  const panoramaInstanceRef = useRef<google.maps.StreetViewPanorama | null>(null);

  useEffect(() => {
    if (!panoramaRef.current) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error('Google Maps API Key não configurada. Adicione NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no .env.local');
      return;
    }

    const loadGoogleMaps = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (window.google?.maps?.StreetViewPanorama) {
          resolve();
          return;
        }

        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]') as HTMLScriptElement;
        if (existingScript) {
          if (window.google?.maps?.StreetViewPanorama) {
            resolve();
          } else {
            existingScript.addEventListener('load', () => resolve());
            existingScript.addEventListener('error', reject);
          }
          return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    loadGoogleMaps()
      .then(() => {
        if (!panoramaRef.current) return;

        // Configuração base do panorama
        const panoramaOptions: google.maps.StreetViewPanoramaOptions = {
          pov: {
            heading: heading,
            pitch: pitch,
          },
          zoom: zoom,
          visible: true,
          enableCloseButton: false,
          showRoadLabels: false,
          fullscreenControl: true,
          panControl: true,
          zoomControl: true,
          addressControl: false,
          linksControl: true, // Permite navegação clicando nas setas
        };

        // Se tiver panoId, usar diretamente (mais preciso)
        if (panoId) {
          (panoramaOptions as google.maps.StreetViewPanoramaOptions & { pano?: string }).pano = panoId;
        } else if (latitude && longitude) {
          panoramaOptions.position = { lat: latitude, lng: longitude };
        }

        const panorama = new google.maps.StreetViewPanorama(
          panoramaRef.current,
          panoramaOptions
        );

        panoramaInstanceRef.current = panorama;

        // Se usar coordenadas, buscar o panorama mais próximo
        if (!panoId && latitude && longitude) {
          const service = new google.maps.StreetViewService();
          service.getPanorama(
            { location: { lat: latitude, lng: longitude }, radius: 50 },
            (data, status) => {
              if (status === 'OK' && data?.location?.pano) {
                panorama.setPano(data.location.pano);
              }
            }
          );
        }
      })
      .catch((error) => {
        console.error('Erro ao carregar Google Maps:', error);
      });

    return () => {
      if (panoramaInstanceRef.current) {
        panoramaInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, panoId, heading, pitch, zoom]);

  return (
    <div
      ref={panoramaRef}
      className={`w-full h-full rounded-lg overflow-hidden ${className}`}
      style={{ minHeight: '400px' }}
      role="img"
      aria-label="Vista panorâmica da fachada da loja Pé Quente Calçados"
    />
  );
}
