import { useState, useEffect, useRef } from 'react';
import { Search, ArrowLeft, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ContentRow } from './ContentRow';
import { mockPremiers, mockPopular, ContentItem } from '@/lib/api';
import { cn } from '@/lib/utils';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Дополнительный контент для бесплатных
const mockFree: ContentItem[] = [
  {
    id: '10',
    title: 'Огниво',
    type: 'movie',
    rating: 8.1,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
    year: 2024,
    genres: ['Сказка'],
  },
  {
    id: '11',
    title: 'Берлинская жара',
    type: 'movie',
    rating: 8.1,
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
    year: 2024,
    genres: ['Боевик'],
  },
  {
    id: '12',
    title: 'Новые жуки',
    type: 'movie',
    rating: 8.1,
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
    year: 2024,
    genres: ['Комедия'],
  },
];

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Фокус на инпут при открытии
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Сброс query при закрытии
  useEffect(() => {
    if (!open) {
      setQuery('');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "!fixed !inset-0 !max-w-none !w-screen !h-screen !translate-x-0 !translate-y-0 !left-0 !top-0",
          "!rounded-none border-0 p-0 bg-background/98 backdrop-blur-xl",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "data-[state=open]:slide-in-from-top-4 data-[state=closed]:slide-out-to-top-4",
          "overflow-y-auto"
        )}
      >
        <VisuallyHidden>
          <DialogTitle>Поиск</DialogTitle>
        </VisuallyHidden>
        
        {/* Шапка с поиском */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center h-16 lg:h-20 gap-4">
              {/* Кнопка назад */}
              <button
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm hidden sm:inline">Назад</span>
              </button>

              {/* Поле поиска */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Поиск"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={cn(
                    "w-full h-12 pl-12 pr-4 rounded-xl",
                    "bg-muted/50 border border-border/50",
                    "text-foreground placeholder:text-foreground/50",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
                    "transition-all duration-200"
                  )}
                />
              </div>

              {/* Кнопка закрыть */}
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 text-foreground/50 hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Контент */}
        <div className="container mx-auto px-4 lg:px-8 py-8 space-y-8">
          <ContentRow title="Премьеры месяца" items={mockPremiers} />
          <ContentRow title="Популярное для вас" items={mockPopular} />
          <ContentRow title="Бесплатные" items={mockFree} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
