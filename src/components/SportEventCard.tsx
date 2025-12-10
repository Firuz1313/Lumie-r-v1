import { type SportEvent } from '@/lib/api';
import { cn } from '@/lib/utils';

interface SportEventCardProps {
  event: SportEvent;
  variant?: 'default' | 'hero';
  className?: string;
}

export function SportEventCard({ event, variant = 'default', className }: SportEventCardProps) {
  const isHero = variant === 'hero';
  
  return (
    <a
      href={`/sport/${event.id}`}
      className={cn(
        "group block rounded-xl overflow-hidden transition-all duration-300",
        "hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10",
        isHero ? "bg-gradient-to-br from-primary/20 to-accent/20" : "bg-card/50 border border-border/30",
        className
      )}
    >
      <div className={cn("p-4", isHero && "p-6")}>
        {/* Лига и дата */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-primary bg-primary/20 px-2 py-1 rounded">
            {event.league}
          </span>
        </div>
        
        {/* Название события */}
        <h3 className={cn(
          "font-semibold text-foreground mb-2 group-hover:text-primary transition-colors",
          isHero ? "text-lg" : "text-sm"
        )}>
          {event.title}
        </h3>
        
        {/* Дата и время */}
        <div className="flex items-center justify-between text-foreground/60 text-xs">
          <span>{event.date}</span>
          <span className="font-medium">{event.time}</span>
        </div>
        
        {/* Индикатор прямого эфира */}
        {event.isLive && (
          <div className="mt-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-red-400 font-medium">LIVE</span>
          </div>
        )}
      </div>
    </a>
  );
}
