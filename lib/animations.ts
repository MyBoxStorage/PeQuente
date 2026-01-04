/**
 * Sistema de animações otimizadas
 * Fade-in on scroll, stagger suave, GPU-accelerated
 */

import React from 'react';

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  threshold?: number;
}

/**
 * Configuração padrão para animações
 */
export const defaultAnimationConfig: Required<AnimationConfig> = {
  duration: 0.6,
  delay: 0,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  threshold: 0.1,
};

/**
 * Variantes de animação para Framer Motion
 */
export const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const fadeIn = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Stagger animation para listas
 * Delay máximo de 100ms entre itens
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Hook para fade-in on scroll usando Intersection Observer
 * GPU-accelerated com will-change
 */
export const useFadeInOnScroll = (
  elementRef: React.RefObject<HTMLElement>,
  config: AnimationConfig = {}
) => {
  const {
    duration = defaultAnimationConfig.duration,
    delay = defaultAnimationConfig.delay,
    threshold = defaultAnimationConfig.threshold,
  } = config;

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Adicionar will-change para GPU acceleration
    element.style.willChange = 'opacity, transform';
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = `opacity ${duration}s ${defaultAnimationConfig.easing} ${delay}s, transform ${duration}s ${defaultAnimationConfig.easing} ${delay}s`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            // Remover will-change após animação
            setTimeout(() => {
              element.style.willChange = 'auto';
            }, (duration + delay) * 1000);
            observer.unobserve(element);
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      element.style.willChange = 'auto';
    };
  }, [elementRef, duration, delay, threshold]);
};

/**
 * Utilitário para adicionar classes de animação CSS
 */
export const getAnimationClasses = (variant: 'fade-in' | 'fade-in-up' | 'scale-in' = 'fade-in-up') => {
  const baseClasses = 'opacity-0';
  
  switch (variant) {
    case 'fade-in':
      return `${baseClasses} animate-fade-in`;
    case 'fade-in-up':
      return `${baseClasses} animate-fade-in-up`;
    case 'scale-in':
      return `${baseClasses} animate-scale-in`;
    default:
      return `${baseClasses} animate-fade-in-up`;
  }
};
