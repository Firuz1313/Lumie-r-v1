import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ContentItem, SportEvent } from '@/lib/api';

type BannerType = 'home' | 'kids' | 'free' | 'sport' | 'collections' | 'tv' | 'catalog';

interface BannerHeroProps {
  type: BannerType;
  items?: ContentItem[];
  sportEvent?: SportEvent;
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  showNav?: boolean;
  onNavClick?: (direction: 'prev' | 'next') => void;
}

const bannerStyles: Record<BannerType, {
  gradient1: string;
  gradient2: string;
  badgeClass: string;
  accentColor: string;
  bgVariants?: string;
}> = {
  home: {
    gradient1: 'from-background via-background/60 to-transparent',
    gradient2: 'from-background/80 via-background/40 to-transparent',
    badgeClass: 'bg-primary text-primary-foreground',
    accentColor: 'text-primary',
  },
  kids: {
    gradient1: 'from-pink-900/90 via-purple-900/70 to-transparent',
    gradient2: 'from-background/80 via-background/50 to-transparent',
    badgeClass: 'bg-pink-500 text-white',
    accentColor: 'text-pink-400',
  },
  free: {
    gradient1: 'from-amber-900/80 via-orange-900/60 to-transparent',
    gradient2: 'from-background/80 via-background/50 to-transparent',
    badgeClass: 'bg-amber-500 text-white',
    accentColor: 'text-amber-400',
  },
  sport: {
    gradient1: 'from-background via-background/70 to-transparent',
    gradient2: 'from-background/80 via-background/50 to-transparent',
    badgeClass: 'bg-green-500 text-white',
    accentColor: 'text-green-400',
  },
  collections: {
    gradient1: 'from-background via-background/60 to-transparent',
    gradient2: 'from-background/80 via-background/50 to-transparent',
    badgeClass: 'bg-purple-500 text-white',
    accentColor: 'text-purple-400',
  },
  tv: {
    gradient1: 'from-background via-background/60 to-transparent',
    gradient2: 'from-background/80 via-background/50 to-transparent',
    badgeClass: 'bg-blue-500 text-white',
    accentColor: 'text-blue-400',
  },
  catalog: {
    gradient1: 'from-background via-background/60 to-transparent',
    gradient2: 'from-background/80 via-background/50 to-transparent',
    badgeClass: 'bg-primary text-primary-foreground',
    accentColor: 'text-primary',
  },
};

export function BannerHero({
  type,
  items = [],
  sportEvent,
  title: customTitle,
  subtitle: customSubtitle,
  backgroundImage: customBackground,
  showNav = true,
  onNavClick,
}: BannerHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const style = bannerStyles[type];

  const currentItem = items.length > 0 ? items[currentIndex] : null;
  const backgroundImage = customBackground || currentItem?.backdrop || currentItem?.poster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop';

  // Автопрокрутка для карусели
  useEffect(() => {
    if (items.length === 0 || !showNav) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length, showNav]);

  const handleNav = (direction: 'prev' | 'next') => {
    if (onNavClick) {
      onNavClick(direction);
    } else if (items.length > 0) {
      setCurrentIndex((prev) => 
        direction === 'prev' 
          ? (prev - 1 + items.length) % items.length 
          : (prev + 1) % items.length
      );
    }
  };

  // Render for sport banner with team info
  if (type === 'sport' && sportEvent?.teams) {
    return (
      <section className="relative min-h-screen lg:h-[90vh] overflow-hidden flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${sportEvent.poster || backgroundImage})` }}
        >
          <div className={`absolute inset-0 bg-gradient-to-t ${style.gradient1}`} />
          <div className={`absolute inset-0 bg-gradient-to-r ${style.gradient2}`} />
        </div>
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24 w-full">
            <div className="max-w-5xl space-y-6 animate-fade-in">
              <span className={cn(
                "inline-block px-3 py-1 text-xs font-bold uppercase",
                style.badgeClass
              )}>
                {sportEvent.league}
              </span>
              
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-8 lg:gap-16">
                {/* Home team */}
                <div className="flex flex-col items-end lg:items-center">
                  {sportEvent.teams.homeLogo ? (
                    <img src={sportEvent.teams.homeLogo} alt={sportEvent.teams.home} className="w-24 h-24 lg:w-32 lg:h-32 mb-3" />
                  ) : (
                    <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white text-3xl lg:text-4xl font-bold mb-3">
                      {sportEvent.teams.home.charAt(0)}
                    </div>
                  )}
                  <span className="text-white text-xl lg:text-2xl font-bold drop-shadow-lg">{sportEvent.teams.home}</span>
                </div>
                
                {/* VS */}
                <div className="flex flex-col items-center gap-3">
                  <span className="text-4xl lg:text-6xl font-black text-white/80">VS</span>
                  {sportEvent.isLive && (
                    <div className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-bold flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      LIVE
                    </div>
                  )}
                </div>
                
                {/* Away team */}
                <div className="flex flex-col items-start lg:items-center">
                  {sportEvent.teams.awayLogo ? (
                    <img src={sportEvent.teams.awayLogo} alt={sportEvent.teams.away} className="w-24 h-24 lg:w-32 lg:h-32 mb-3" />
                  ) : (
                    <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center text-white text-3xl lg:text-4xl font-bold mb-3">
                      {sportEvent.teams.away.charAt(0)}
                    </div>
                  )}
                  <span className="text-white text-xl lg:text-2xl font-bold drop-shadow-lg">{sportEvent.teams.away}</span>
                </div>
              </div>
              
              <div className="text-white/90 text-lg lg:text-xl">
                {sportEvent.isLive ? (
                  <span className="font-semibold">Идёт прямая трансляция</span>
                ) : (
                  <span>Трансляция начнётся {sportEvent.date.toLowerCase()} в {sportEvent.time}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Standard content banner
  return (
    <section className="relative min-h-screen lg:h-[90vh] overflow-hidden">
      {/* Background carousel */}
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
            loading="lazy"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${style.gradient1}`} />
          <div className={`absolute inset-0 bg-gradient-to-r ${style.gradient2}`} />
        </div>
      ))}

      {/* Static background for non-carousel banners */}
      {items.length === 0 && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className={`absolute inset-0 bg-gradient-to-t ${style.gradient1}`} />
          <div className={`absolute inset-0 bg-gradient-to-r ${style.gradient2}`} />
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24 w-full">
          <div className="max-w-3xl space-y-4 animate-fade-in">
            {/* Badge */}
            <span className={cn(
              "inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider",
              style.badgeClass
            )}>
              {currentItem ? (currentItem.type === 'movie' ? 'Фильм' : 'Сериал') : (type === 'kids' ? 'Для детей' : type.charAt(0).toUpperCase() + type.slice(1))}
            </span>

            {/* Title */}
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black text-white leading-tight drop-shadow-2xl">
              {customTitle || currentItem?.title || 'Найдите свой фильм'}
            </h1>

            {/* Metadata */}
            {currentItem && (
              <div className="flex items-center gap-4 text-white/90 text-sm lg:text-base flex-wrap">
                <span className={cn("font-bold", style.accentColor)}>★ {currentItem.rating.toFixed(1)}</span>
                {currentItem.year && <span>{currentItem.year}</span>}
                {currentItem.genres && (
                  <>
                    <span className="text-white/60">•</span>
                    <span>{currentItem.genres.slice(0, 2).join(', ')}</span>
                  </>
                )}
              </div>
            )}

            {/* Description */}
            {currentItem?.description && (
              <p className="text-white/90 text-base lg:text-lg max-w-2xl line-clamp-2 leading-relaxed">
                {currentItem.description}
              </p>
            )}

            {/* Custom subtitle */}
            {customSubtitle && (
              <p className="text-white/90 text-base lg:text-lg max-w-2xl leading-relaxed">
                {customSubtitle}
              </p>
            )}

            {/* Action buttons */}
            {currentItem && (
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
            )}
          </div>
        </div>
      </div>

      {/* Navigation for carousel */}
      {showNav && items.length > 1 && (
        <div className="absolute bottom-8 right-8 flex items-center gap-4 z-20 flex-col lg:flex-row">
          {/* Indicators */}
          <div className="flex gap-2 flex-wrap justify-end">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "rounded-full transition-all duration-300",
                  index === currentIndex 
                    ? "w-8 h-2 bg-white" 
                    : "w-2 h-2 bg-white/40 hover:bg-white/60"
                )}
              />
            ))}
          </div>

          {/* Arrow buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleNav('prev')}
              className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border border-white/30 flex items-center justify-center text-white transition-all backdrop-blur-sm hover:shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleNav('next')}
              className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border border-white/30 flex items-center justify-center text-white transition-all backdrop-blur-sm hover:shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
