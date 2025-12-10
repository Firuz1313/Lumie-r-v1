import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setIsTransitioning(true);
    
    // Небольшая задержка перед изменением контента для плавного перехода
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname, children]);

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-out',
        isTransitioning && 'opacity-0 scale-98',
        !isTransitioning && 'opacity-100 scale-100',
        className
      )}
    >
      {displayChildren}
    </div>
  );
}

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedPage({ children, className }: AnimatedPageProps) {
  return (
    <div
      className={cn(
        'animate-fade-in',
        className
      )}
    >
      {children}
    </div>
  );
}

// Hook для получения информации о переходе между страницами
export function usePageTransition() {
  const location = useLocation();
  const [transitionState, setTransitionState] = useState<'enter' | 'exit' | 'idle'>('idle');

  useEffect(() => {
    setTransitionState('exit');
    const timer = setTimeout(() => {
      setTransitionState('enter');
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return transitionState;
}
