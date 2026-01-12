'use client';

import { useEffect, useRef } from 'react';

interface StreetViewProps {
  latitude: number;
  longitude: number;
  heading?: number; // direção da câmera (0-360)
  pitch?: number; // inclinação da câmera (-90 a 90)
  zoom?: number;
  className?: string;
}

export default function StreetView({
  latitude,
  longitude,
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

    // Carregar o script do Google Maps se ainda não estiver carregado
    const loadGoogleMaps = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (window.google?.maps?.StreetViewPanorama) {
          resolve();
          return;
        }

        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]') as HTMLScriptElement;
        if (existingScript) {
          // Script já existe, aguardar carregamento
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

        // Criar panorama do Street View
        const panorama = new google.maps.StreetViewPanorama(panoramaRef.current, {
          position: { lat: latitude, lng: longitude },
          pov: {
            heading: heading,
            pitch: pitch,
          },
          zoom: zoom,
          visible: true,
          enableCloseButton: false,
          showRoadLabels: false,
          fullscreenControl: false,
          panControl: true,
          zoomControl: true,
          addressControl: false,
          linksControl: true, // Permite navegação clicando nas setas
        });

        panoramaInstanceRef.current = panorama;

        // Verificar se há Street View disponível na posição
        const service = new google.maps.StreetViewService();
        service.getPanorama(
          { location: { lat: latitude, lng: longitude }, radius: 50 },
          (data, status) => {
            if (status === 'OK' && data) {
              // Se encontrar panorama, usar a posição exata do panorama
              if (data.location.pano) {
                panorama.setPano(data.location.pano);
              }
              panorama.setPosition(data.location.latLng);
            } else {
              console.warn('Street View não disponível nesta localização');
            }
          }
        );
      })
      .catch((error) => {
        console.error('Erro ao carregar Google Maps:', error);
      });

    // Cleanup
    return () => {
      if (panoramaInstanceRef.current) {
        panoramaInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, heading, pitch, zoom]);

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
