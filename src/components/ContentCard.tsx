import { cn } from '@/lib/utils';
import type { ContentItem } from '@/lib/api';

interface ContentCardProps {
  item: ContentItem;
  variant?: 'default' | 'large' | 'hero';
  className?: string;
}

export function ContentCard({ item, variant = 'default', className }: ContentCardProps) {
  const typeLabel = item.type === 'movie' ? 'Фильм' : 'Сериал';
  const isHero = variant === 'hero';
  
  return (
    <a
      href={`/watch/${item.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-xl",
        isHero && "aspect-[16/9] bg-card/60 border border-border/40 backdrop-blur-sm",
        variant === 'large' && "aspect-[3/4]",
        variant === 'default' && "aspect-[3/4]",
        className
      )}
    >
      {/* Постер */}
      <img
        src={isHero ? (item.backdrop || item.poster) : item.poster}
        alt={item.title}
        className={cn(
          "w-full h-full object-cover transition-transform duration-500",
          "group-hover:scale-110"
        )}
      />
      
      {/* Градиент затемнения */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent opacity-75" />
      
      {/* Бейдж типа контента */}
      <div className="absolute top-3 left-3">
        <span className={cn(
          "px-3 py-1.5 rounded-lg text-xs font-semibold",
          item.type === 'movie' 
            ? "bg-primary text-primary-foreground" 
            : "bg-secondary text-secondary-foreground"
        )}>
          {typeLabel}
        </span>
      </div>
      
      {/* Рейтинг */}
      <div className="absolute top-3 right-3">
        <span className="px-2.5 py-1 rounded-lg bg-background/90 backdrop-blur-sm text-foreground text-sm font-bold">
          {item.rating.toFixed(1)}
        </span>
      </div>
      
      {/* Информация внизу карточки */}
      {isHero && (
        <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl lg:text-2xl font-bold text-foreground transition-transform duration-300 group-hover:-translate-y-1">
              {item.title}
            </h3>
            {(item.genres || item.year) && (
              <p className="text-foreground/80 text-sm leading-relaxed opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out delay-75">
                {item.genres?.join(' • ')} {item.year && `• ${item.year}`}
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Hover эффект для обычных карточек (default/large) */}
      {!isHero && (
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold text-foreground transition-transform duration-300 group-hover:-translate-y-0.5">
              {item.title}
            </h4>
            {(item.genres || item.year) && (
              <p className="text-xs text-foreground/70 leading-tight opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out delay-75">
                {item.genres?.join(' • ')} {item.year && `• ${item.year}`}
              </p>
            )}
          </div>
        </div>
      )}
    </a>
  );
}
