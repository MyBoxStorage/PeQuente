declare namespace google {
  namespace maps {
    class StreetViewPanorama {
      constructor(container: HTMLElement, opts?: StreetViewPanoramaOptions);
      setPosition(latLng: LatLng | LatLngLiteral): void;
      setPano(pano: string): void;
    }

    interface StreetViewPanoramaOptions {
      position?: LatLng | LatLngLiteral;
      pov?: {
        heading: number;
        pitch: number;
      };
      zoom?: number;
      visible?: boolean;
      enableCloseButton?: boolean;
      showRoadLabels?: boolean;
      fullscreenControl?: boolean;
      panControl?: boolean;
      zoomControl?: boolean;
      addressControl?: boolean;
      linksControl?: boolean;
    }

    class StreetViewService {
      getPanorama(
        request: StreetViewLocationRequest,
        callback: (
          data: StreetViewPanoramaData | null,
          status: StreetViewStatus
        ) => void
      ): void;
    }

    interface StreetViewLocationRequest {
      location?: LatLng | LatLngLiteral;
      radius?: number;
      pano?: string;
    }

    interface StreetViewPanoramaData {
      location: {
        latLng: LatLng;
        pano?: string;
      };
    }

    type StreetViewStatus = 'OK' | 'UNKNOWN_ERROR' | 'ZERO_RESULTS';

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
  }
}

declare global {
  interface Window {
    google?: typeof google;
  }
}
