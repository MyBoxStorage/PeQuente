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
 * Gera URLs dos modelos 3D (pé esquerdo e direito) baseado no slug do produto
 */
export function getModelUrls(slug: string): { left: string; right: string } {
  return {
    left: `/models/${slug}-left.glb`,
    right: `/models/${slug}-right.glb`,
  };
}