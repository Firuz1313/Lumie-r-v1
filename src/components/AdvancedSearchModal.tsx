import { useState, useEffect, useRef } from 'react';
import { Search, ArrowLeft, X, Sparkles, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ContentRow } from './ContentRow';
import { getAllContent, type ContentItem } from '@/lib/api';
import { searchContent, getAutocompleteSuggestions, getPopularSearches, SearchResult } from '@/lib/search';
import { cn } from '@/lib/utils';

interface AdvancedSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdvancedSearchModal({ open, onOpenChange }: AdvancedSearchModalProps) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Загрузка контента при открытии
  useEffect(() => {
    if (open) {
      const content = getAllContent();
      setAllContent(content);
      setPopularSearches(getPopularSearches(content, 6));
      inputRef.current?.focus();
    }
  }, [open]);

  // Обновление результатов поиска при изменении query
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setSuggestions([]);
      setSelectedSuggestionIndex(-1);
      return;
    }

    // Умный поиск с ранжированием
    const results = searchContent(allContent, query, undefined, 20);
    setSearchResults(results);

    // Автокомплит предложения
    const autocomplete = getAutocompleteSuggestions(allContent, query, 8);
    setSuggestions(autocomplete);
    setSelectedSuggestionIndex(-1);
  }, [query, allContent]);

  // Закрытие при ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }

      // Навигация по предложениям
      if (suggestions.length > 0 && ['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) {
        e.preventDefault();

        if (e.key === 'ArrowDown') {
          setSelectedSuggestionIndex((prev) => (prev + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
          setSelectedSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
          setQuery(suggestions[selectedSuggestionIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [suggestions, selectedSuggestionIndex, open, onOpenChange]);

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    inputRef.current?.focus();
  };

  const handlePopularSearchClick = (search: string) => {
    setQuery(search);
  };

  const resultItems = searchResults.map((r) => r.item);

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
          <DialogTitle>Расширенный поиск</DialogTitle>
        </VisuallyHidden>
        
        {/* Sticky search header */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center h-16 lg:h-20 gap-4">
              {/* Back button */}
              <button
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm hidden sm:inline">Назад</span>
              </button>

              {/* Search input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Поиск фильмов, сериалов, жанров..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={cn(
                    "w-full h-12 pl-12 pr-4 rounded-xl",
                    "bg-muted/50 border border-border/50",
                    "text-foreground placeholder:text-foreground/50",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
                    "transition-all duration-200"
                  )}
                  autoComplete="off"
                />
              </div>

              {/* Close button */}
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 text-foreground/50 hover:text-foreground transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Search content */}
        <div className="container mx-auto px-4 lg:px-8 py-8 space-y-8">
          {/* Suggestions и популярные поиски */}
          {!query.trim() ? (
            <div className="space-y-8">
              {/* Popular searches */}
              {popularSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Популярные поиски</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {popularSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => handlePopularSearchClick(search)}
                        className="px-4 py-3 rounded-lg bg-card/50 border border-border/40 hover:border-primary/50 text-foreground hover:bg-card transition-all text-sm font-medium"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Featured content */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-semibold text-foreground">Рекомендуемое</h3>
                </div>
                {allContent.length > 0 && (
                  <ContentRow 
                    title=""
                    items={allContent.slice(0, 8)}
                    variant="default"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Autocomplete suggestions */}
              {suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="space-y-2"
                >
                  <h4 className="text-sm font-semibold text-foreground/70 px-4">Предложения</h4>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      onMouseEnter={() => setSelectedSuggestionIndex(index)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-lg transition-colors",
                        index === selectedSuggestionIndex
                          ? "bg-muted text-foreground"
                          : "text-foreground/80 hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Search className="w-4 h-4 text-foreground/50" />
                        <span>{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Search results */}
              {searchResults.length > 0 ? (
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-foreground/60">
                      Найдено {searchResults.length} результатов
                    </p>
                  </div>
                  <ContentRow 
                    title="Результаты поиска"
                    items={resultItems.slice(0, 12)}
                    variant="default"
                  />
                </div>
              ) : query.trim() && (
                <div className="text-center py-12">
                  <p className="text-foreground/60">Ничего не найдено по запросу "{query}"</p>
                  <p className="text-sm text-foreground/40 mt-2">Попробуйте другой поисковый запрос</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
