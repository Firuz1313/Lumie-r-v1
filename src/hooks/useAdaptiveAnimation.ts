import { useMemo } from 'react';

/**
 * Hook для адаптивных анимаций, который учитывает предпочтения пользователя
 * Автоматически отключает анимации для пользователей с prefers-reduced-motion
 */

export interface AnimationConfig {
  type: 'fade' | 'slide' | 'scale' | 'bounce' | 'float' | 'rotate' | 'glow' | 'shimmer';
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: 'fast' | 'normal' | 'slow';
  delay?: number;
  infinite?: boolean;
}

export function useAdaptiveAnimation(config: AnimationConfig) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const animationClass = useMemo(() => {
    // Si l'utilisateur préfère les animations réduites, retourner une classe vide
    if (prefersReducedMotion) {
      return '';
    }

    let baseClass = '';

    // Déterminer la classe d'animation de base
    switch (config.type) {
      case 'fade':
        if (config.direction) {
          baseClass = `animate-fade-in-${config.direction}`;
        } else {
          baseClass = 'animate-fade-in';
        }
        break;

      case 'slide':
        if (config.direction === 'down') {
          baseClass = 'animate-slide-in-down';
        } else {
          baseClass = 'animate-slide-in';
        }
        break;

      case 'scale':
        baseClass = 'animate-scale-in';
        break;

      case 'bounce':
        baseClass = 'animate-bounce-in';
        break;

      case 'float':
        baseClass = 'animate-float';
        break;

      case 'rotate':
        baseClass = 'animate-rotate-in';
        break;

      case 'glow':
        baseClass = 'animate-pulse-glow';
        break;

      case 'shimmer':
        baseClass = 'animate-shimmer';
        break;

      default:
        baseClass = 'animate-fade-in';
    }

    // Ajouter des classes de durée
    let durationClass = '';
    switch (config.duration) {
      case 'fast':
        durationClass = '[animation-duration:300ms]';
        break;
      case 'slow':
        durationClass = '[animation-duration:800ms]';
        break;
      default:
        durationClass = '';
    }

    // Ajouter le délai d'animation si spécifié
    let delayClass = '';
    if (config.delay && config.delay > 0) {
      delayClass = `[animation-delay:${config.delay}ms]`;
    }

    // Ajouter la classe d'animation infinie si spécifiée
    let infiniteClass = '';
    if (config.infinite) {
      infiniteClass = '[animation-iteration-count:infinite]';
    }

    return `${baseClass} ${durationClass} ${delayClass} ${infiniteClass}`.trim();
  }, [config, prefersReducedMotion]);

  return {
    className: animationClass,
    prefersReducedMotion,
  };
}

/**
 * Hook pour vérifier si l'utilisateur préfère les animations réduites
 */
export function usePrefersReducedMotion(): boolean {
  // Vérifier la préférence au moment du rendu
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
}

/**
 * Composant wrapper pour appliquer les animations adaptatives facilement
 */
interface AdaptiveAnimationProps {
  children: React.ReactNode;
  config: AnimationConfig;
  className?: string;
  as?: React.ElementType;
}

export function AdaptiveAnimation({
  children,
  config,
  className,
  as: Component = 'div',
}: AdaptiveAnimationProps) {
  const { className: animationClass } = useAdaptiveAnimation(config);

  return (
    <Component className={`${animationClass} ${className || ''}`.trim()}>
      {children}
    </Component>
  );
}

/**
 * Collection de configurations d'animations pré-définies
 */
export const animationPresets = {
  // Animations d'entrée
  fadeIn: {
    type: 'fade' as const,
    duration: 'normal' as const,
  },
  fadeInUp: {
    type: 'fade' as const,
    direction: 'up' as const,
    duration: 'normal' as const,
  },
  fadeInDown: {
    type: 'fade' as const,
    direction: 'down' as const,
    duration: 'normal' as const,
  },
  fadeInLeft: {
    type: 'fade' as const,
    direction: 'left' as const,
    duration: 'normal' as const,
  },
  fadeInRight: {
    type: 'fade' as const,
    direction: 'right' as const,
    duration: 'normal' as const,
  },

  // Animations de glissement
  slideInDown: {
    type: 'slide' as const,
    direction: 'down' as const,
    duration: 'normal' as const,
  },
  slideIn: {
    type: 'slide' as const,
    duration: 'normal' as const,
  },

  // Animations d'échelle
  scaleIn: {
    type: 'scale' as const,
    duration: 'fast' as const,
  },

  // Animations de rebond
  bounceIn: {
    type: 'bounce' as const,
    duration: 'slow' as const,
  },

  // Animations en boucle
  float: {
    type: 'float' as const,
    infinite: true,
  },
  glow: {
    type: 'glow' as const,
    infinite: true,
  },
  shimmer: {
    type: 'shimmer' as const,
    infinite: true,
  },

  // Animation de rotation
  rotateIn: {
    type: 'rotate' as const,
    duration: 'normal' as const,
  },
};