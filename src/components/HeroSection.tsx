import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ContentItem } from '@/lib/api';

interface HeroSectionProps {
  items: ContentItem[];
}

export function HeroSection({ items }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = items[currentIndex];

  // Автопрокрутка
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  if (!currentItem) return null;

  return (
    <section className="relative h-[85vh] lg:h-[90vh] overflow-hidden">
      {/* Фоновое изображение */}
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <img
            src={item.backdrop || item.poster}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          {/* Градиент снизу для читаемости текста */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
        </div>
      ))}

      {/* Контент - в стиле киносайта */}
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24 w-full">
          <div className="max-w-3xl space-y-4 animate-fade-in">
            {/* Бейдж типа */}
            <span className={cn(
              "inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider",
              currentItem.type === 'movie' 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground"
            )}>
              {currentItem.type === 'movie' ? 'Фильм' : 'Сериал'}
            </span>

            {/* Заголовок - крупный, жирный */}
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black text-white leading-tight drop-shadow-2xl">
              {currentItem.title}
            </h1>

            {/* Метаданные в одну строку */}
            <div className="flex items-center gap-4 text-white/90 text-sm lg:text-base">
              <span className="font-bold text-yellow-400">★ {currentItem.rating.toFixed(1)}</span>
              {currentItem.year && <span>{currentItem.year}</span>}
              {currentItem.genres && (
                <>
                  <span className="text-white/60">•</span>
                  <span>{currentItem.genres.slice(0, 2).join(', ')}</span>
                </>
              )}
            </div>

            {/* Описание */}
            {currentItem.description && (
              <p className="text-white/90 text-base lg:text-lg max-w-2xl line-clamp-2 leading-relaxed">
                {currentItem.description}
              </p>
            )}

            {/* Кнопки действий - крупные */}
            <div className="flex items-center gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-white hover:bg-white/90 text-black font-bold gap-2 px-8 py-6 text-lg rounded-lg shadow-xl"
              >
                <Play className="w-6 h-6 fill-current" />
                Смотреть
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white/50 text-white hover:bg-white/20 font-semibold px-8 py-6 text-lg rounded-lg backdrop-blur-sm"
              >
                Трейлер
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Навигация - справа внизу */}
      <div className="absolute bottom-8 right-8 flex items-center gap-4 z-20">
        {/* Индикаторы */}
        <div className="flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "w-8 bg-white" 
                  : "bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </div>

        {/* Стрелки */}
        <div className="flex gap-2">
          <button
            onClick={goToPrev}
            className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border border-white/30 flex items-center justify-center text-white transition-all backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border border-white/30 flex items-center justify-center text-white transition-all backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
