import { cn } from '@/lib/utils';

interface CategoryCardProps {
  title: string;
  image: string;
  href: string;
  color?: string;
}

export function CategoryCard({ title, image, href, color = 'bg-primary/30' }: CategoryCardProps) {
  return (
    <a
      href={href}
      className={cn(
        "relative group block overflow-hidden rounded-xl",
        "aspect-[4/3] min-w-[200px]",
        "transition-all duration-300 ease-out",
        "hover:scale-[1.02] hover:shadow-xl"
      )}
    >
      {/* Фоновый градиент */}
      <div className={cn(
        "absolute inset-0",
        color
      )} />
      
      {/* Изображение контента */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
      />
      
      {/* Оверлей */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      
      {/* Название категории */}
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
    </a>
  );
}
