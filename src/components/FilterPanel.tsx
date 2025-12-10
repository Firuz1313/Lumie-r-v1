import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FilterState {
  genres: string[];
  types: ('movie' | 'series')[];
  minRating: number;
  yearRange: [number, number];
  sortBy: 'relevance' | 'rating' | 'year' | 'title';
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableGenres: string[];
  minYear?: number;
  maxYear?: number;
  className?: string;
}

export function FilterPanel({
  filters,
  onFilterChange,
  availableGenres,
  minYear = 1990,
  maxYear = new Date().getFullYear(),
  className,
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    genres: true,
    type: true,
    rating: false,
    year: false,
    sort: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleGenre = (genre: string) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter((g) => g !== genre)
      : [...filters.genres, genre];
    onFilterChange({ ...filters, genres: newGenres });
  };

  const toggleType = (type: 'movie' | 'series') => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    onFilterChange({ ...filters, types: newTypes });
  };

  const setRating = (rating: number) => {
    onFilterChange({ ...filters, minRating: rating });
  };

  const setYearRange = (min: number, max: number) => {
    onFilterChange({ ...filters, yearRange: [min, max] });
  };

  const setSortBy = (sortBy: FilterState['sortBy']) => {
    onFilterChange({ ...filters, sortBy });
  };

  const hasActiveFilters =
    filters.genres.length > 0 ||
    filters.types.length > 0 ||
    filters.minRating > 0 ||
    filters.yearRange[0] > minYear ||
    filters.yearRange[1] < maxYear;

  const handleReset = () => {
    onFilterChange({
      genres: [],
      types: ['movie', 'series'],
      minRating: 0,
      yearRange: [minYear, maxYear],
      sortBy: 'relevance',
    });
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header с кнопкой сброса */}
      <div className="flex items-center justify-between pb-4 border-b border-border/30">
        <h3 className="font-semibold text-foreground">Фильтры</h3>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Сбросить
          </button>
        )}
      </div>

      {/* Жанры */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection('genres')}
          className="w-full flex items-center justify-between py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          <span>Жанры</span>
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform',
              expandedSections.genres && 'rotate-180'
            )}
          />
        </button>
        {expandedSections.genres && (
          <div className="space-y-2 pl-2">
            {availableGenres.map((genre) => (
              <label key={genre} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.genres.includes(genre)}
                  onChange={() => toggleGenre(genre)}
                  className="w-4 h-4 rounded border border-border/50 checked:bg-primary checked:border-primary transition-colors"
                />
                <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                  {genre}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Тип контента */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection('type')}
          className="w-full flex items-center justify-between py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          <span>Тип контента</span>
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform',
              expandedSections.type && 'rotate-180'
            )}
          />
        </button>
        {expandedSections.type && (
          <div className="space-y-2 pl-2">
            {(['movie', 'series'] as const).map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.types.includes(type)}
                  onChange={() => toggleType(type)}
                  className="w-4 h-4 rounded border border-border/50 checked:bg-primary checked:border-primary transition-colors"
                />
                <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                  {type === 'movie' ? 'Фильмы' : 'Сериалы'}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Рейтинг */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          <span>Минимальный рейтинг</span>
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform',
              expandedSections.rating && 'rotate-180'
            )}
          />
        </button>
        {expandedSections.rating && (
          <div className="space-y-3 pl-2">
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={filters.minRating}
              onChange={(e) => setRating(parseFloat(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex items-center justify-between text-xs text-foreground/60">
              <span>0</span>
              <span className="font-medium text-foreground">{filters.minRating.toFixed(1)}</span>
              <span>10</span>
            </div>
          </div>
        )}
      </div>

      {/* Год выпуска */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection('year')}
          className="w-full flex items-center justify-between py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          <span>Год выпуска</span>
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform',
              expandedSections.year && 'rotate-180'
            )}
          />
        </button>
        {expandedSections.year && (
          <div className="space-y-3 pl-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={minYear}
                max={maxYear}
                value={filters.yearRange[0]}
                onChange={(e) => setYearRange(Math.min(parseInt(e.target.value), filters.yearRange[1]), filters.yearRange[1])}
                className="w-16 px-2 py-1 bg-muted border border-border/50 rounded text-sm text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <span className="text-foreground/60">—</span>
              <input
                type="number"
                min={minYear}
                max={maxYear}
                value={filters.yearRange[1]}
                onChange={(e) => setYearRange(filters.yearRange[0], Math.max(parseInt(e.target.value), filters.yearRange[0]))}
                className="w-16 px-2 py-1 bg-muted border border-border/50 rounded text-sm text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        )}
      </div>

      {/* Сортировка */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection('sort')}
          className="w-full flex items-center justify-between py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          <span>Сортировка</span>
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform',
              expandedSections.sort && 'rotate-180'
            )}
          />
        </button>
        {expandedSections.sort && (
          <div className="space-y-2 pl-2">
            {(
              [
                { value: 'relevance' as const, label: 'По релевантности' },
                { value: 'rating' as const, label: 'По рейтингу' },
                { value: 'year' as const, label: 'По году (новые)' },
                { value: 'title' as const, label: 'По названию' },
              ] as const
            ).map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="sort"
                  checked={filters.sortBy === value}
                  onChange={() => setSortBy(value)}
                  className="w-4 h-4 border border-border/50 checked:bg-primary checked:border-primary transition-colors cursor-pointer"
                />
                <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Кнопка применения фильтров (опционально) */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full"
          onClick={handleReset}
        >
          Очистить фильтры
        </Button>
      )}
    </div>
  );
}
