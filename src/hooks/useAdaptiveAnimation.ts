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
    if (prefersReducedMotion) {
      return '';
    }

    let baseClass = '';

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

    let delayClass = '';
    if (config.delay && config.delay > 0) {
      delayClass = `[animation-delay:${config.delay}ms]`;
    }

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
 * Hook для проверки предпочтения пользователя о сокращенных анимациях
 */
export function usePrefersReducedMotion(): boolean {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
}

/**
 * Коллекция пред-определенных конфигураций анимаций
 */
export const animationPresets = {
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
  slideInDown: {
    type: 'slide' as const,
    direction: 'down' as const,
    duration: 'normal' as const,
  },
  slideIn: {
    type: 'slide' as const,
    duration: 'normal' as const,
  },
  scaleIn: {
    type: 'scale' as const,
    duration: 'fast' as const,
  },
  bounceIn: {
    type: 'bounce' as const,
    duration: 'slow' as const,
  },
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
  rotateIn: {
    type: 'rotate' as const,
    duration: 'normal' as const,
  },
};
