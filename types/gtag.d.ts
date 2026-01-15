// Declaração global para Google Analytics gtag
interface Window {
  gtag?: (...args: unknown[]) => void;
}
