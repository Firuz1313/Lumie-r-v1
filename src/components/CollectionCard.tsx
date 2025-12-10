import { type Collection } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Film, Tv, Star, Rocket, FileText, Smile, Flame, Play, List } from 'lucide-react';

interface CollectionCardProps {
  collection: Collection;
  className?: string;
}

const iconMap: Record<string, React.ElementType> = {
  movies: Film,
  series: Tv,
  shows: Star,
  'popular-movies': Play,
  adventures: Rocket,
  'popular-series': List,
  sport: Flame,
  documentary: FileText,
  kids: Smile,
};

export function CollectionCard({ collection, className }: CollectionCardProps) {
  const Icon = iconMap[collection.slug] || Film;
  
  return (
    <a
      href={`/collections/${collection.slug}`}
      className={cn(
        "group relative block rounded-2xl overflow-hidden aspect-[4/3] transition-all duration-300",
        "hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20",
        className
      )}
    >
      {/* Фон с градиентом */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br",
        collection.gradient
      )} />
      
      {/* Изображение (если есть) */}
      {collection.image && (
        <div className="absolute inset-0">
          <img 
            src={collection.image} 
            alt={collection.name}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity"
          />
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-60",
            collection.gradient
          )} />
        </div>
      )}
      
      {/* Контент */}
      <div className="relative z-10 h-full flex flex-col justify-between p-4">
        {/* Название */}
        <span className="text-white font-semibold text-sm bg-black/30 px-3 py-1 rounded-lg self-start backdrop-blur-sm">
          {collection.name}
        </span>
        
        {/* Иконка */}
        {!collection.image && (
          <div className="flex-1 flex items-center justify-center">
            <Icon className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform" />
          </div>
        )}
      </div>
    </a>
  );
}
