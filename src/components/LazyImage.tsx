import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  onLoad?: () => void;
}

export function LazyImage({
  src,
  alt,
  className,
  placeholderClassName,
  onLoad,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <>
      {/* Placeholder */}
      {!isLoaded && (
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse',
            placeholderClassName
          )}
        />
      )}

      {/* Lazy loaded image */}
      <img
        ref={imgRef}
        src={isInView ? src : undefined}
        alt={alt}
        onLoad={handleLoad}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
      />
    </>
  );
}

interface LazyCardProps {
  children: React.ReactNode;
  className?: string;
  onVisible?: () => void;
}

export function LazyCard({ children, className, onVisible }: LazyCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          onVisible?.();
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '100px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [onVisible]);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-500',
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4',
        className
      )}
    >
      {isVisible && children}
    </div>
  );
}

interface InfiniteScrollProps {
  onLoadMore: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
  threshold?: number;
}

export function InfiniteScroll({
  onLoadMore,
  isLoading,
  hasMore = true,
  threshold = 0.1,
}: InfiniteScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [onLoadMore, hasMore, isLoading, threshold]);

  return (
    <div
      ref={ref}
      className={cn(
        'py-8 flex items-center justify-center',
        isLoading && 'opacity-50'
      )}
    >
      {isLoading && (
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
}
