import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ContentCard } from './ContentCard';
import { cn } from '@/lib/utils';
import type { ContentItem } from '@/lib/api';

interface ContentRowProps {
  title: string;
  items: ContentItem[];
  variant?: 'default' | 'large' | 'hero';
}

export function ContentRow({ title, items, variant = 'default' }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const cardWidth = variant === 'hero' ? 'w-[520px] lg:w-[620px]' : 'w-[180px] lg:w-[220px]';

  return (
    <section className="relative py-6 animate-fade-in">
      {/* Заголовок секции */}
      <div className="container mx-auto px-4 lg:px-8 mb-4 flex items-center justify-between">
        <h2 className="text-xl lg:text-2xl font-bold text-foreground">
          {title}
        </h2>
        
        {/* Кнопки навигации */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={cn(
              "w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all",
              canScrollLeft 
                ? "text-foreground hover:bg-muted hover:border-foreground/50" 
                : "text-muted-foreground opacity-50 cursor-not-allowed"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={cn(
              "w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all",
              canScrollRight 
                ? "text-foreground hover:bg-muted hover:border-foreground/50" 
                : "text-muted-foreground opacity-50 cursor-not-allowed"
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Карусель контента */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 lg:px-8 pb-4"
      >
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className={cn("flex-shrink-0", cardWidth)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <ContentCard 
              item={item} 
              variant={variant}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
