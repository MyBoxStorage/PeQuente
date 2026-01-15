import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function formatInstallment(price: number, installments: number = 10): string {
  const installmentPrice = price / installments;
  return `${installments}X ${formatPrice(installmentPrice)}`;
}

/**
 * Gera URL do modelo 3D do par de tênis baseado no slug do produto
 */
export function getModel3DUrl(slug: string): string | null {
  // Mapeamento de produtos com modelos 3D disponíveis
  const PRODUCTS_WITH_3D: Record<string, string> = {
    'tenis-adidas-adizero-drive-rc-masculino': '/models/par-3d-v1.glb',
  };
  
  return PRODUCTS_WITH_3D[slug] || null;
}

/**
 * Verifica se um produto tem modelo 3D disponível
 */
export function hasModel3D(slug: string): boolean {
  return getModel3DUrl(slug) !== null;
}