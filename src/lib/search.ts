import type { ContentItem } from './api';

export interface SearchResult {
  item: ContentItem;
  relevance: number;
  matchType: 'title' | 'genre' | 'description';
}

// Функция для нормализации текста
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

// Функция для расчета релевантности результатов
export function calculateRelevance(
  item: ContentItem,
  query: string,
  userPreferences?: { favoriteGenres?: string[]; watchedTypes?: string[] }
): number {
  const normalizedQuery = normalizeText(query);
  let score = 0;

  // Точное совпадение в названии - максимальный приоритет
  if (normalizeText(item.title) === normalizedQuery) {
    score += 1000;
  }

  // Совпадение начала названия
  if (normalizeText(item.title).startsWith(normalizedQuery)) {
    score += 500;
  }

  // Содержит в названии
  if (normalizeText(item.title).includes(normalizedQuery)) {
    score += 300;
  }

  // Совпадение в жанрах
  if (item.genres) {
    item.genres.forEach((genre) => {
      if (normalizeText(genre).includes(normalizedQuery)) {
        score += 200;
      }
    });
  }

  // Совпадение в описании
  if (item.description && normalizeText(item.description).includes(normalizedQuery)) {
    score += 100;
  }

  // Бонус за высокий рейтинг
  score += item.rating * 10;

  // Бонус за совпадение жанров с предпочтениями пользователя
  if (userPreferences?.favoriteGenres && item.genres) {
    const matchingGenres = item.genres.filter((g) =>
      userPreferences.favoriteGenres!.some((fav) => normalizeText(g).includes(normalizeText(fav)))
    );
    score += matchingGenres.length * 50;
  }

  // Штраф за старые фильмы (можно отключить по желанию)
  if (item.year && item.year < 2020) {
    score *= 0.95;
  }

  return score;
}

// Функция для поиска с умным ранжированием
export function searchContent(
  items: ContentItem[],
  query: string,
  userPreferences?: { favoriteGenres?: string[]; watchedTypes?: string[] },
  limit: number = 10
): SearchResult[] {
  if (!query.trim()) {
    // Возвращаем популярные и новые фильмы при пустом запросе
    return items
      .slice(0, limit)
      .map((item) => ({
        item,
        relevance: item.rating,
        matchType: 'title' as const,
      }))
      .sort((a, b) => b.relevance - a.relevance);
  }

  const normalizedQuery = normalizeText(query);
  const results: SearchResult[] = [];

  items.forEach((item) => {
    const relevance = calculateRelevance(item, normalizedQuery, userPreferences);

    // Фильтруем результаты с минимальной релевантностью
    if (relevance > 0) {
      let matchType: 'title' | 'genre' | 'description' = 'title';

      if (normalizeText(item.title).includes(normalizedQuery)) {
        matchType = 'title';
      } else if (item.genres?.some((g) => normalizeText(g).includes(normalizedQuery))) {
        matchType = 'genre';
      } else if (item.description?.includes(normalizedQuery)) {
        matchType = 'description';
      }

      results.push({
        item,
        relevance,
        matchType,
      });
    }
  });

  // Сортируем по релевантности
  return results
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);
}

// Функция для получения предложений автокомплита
export function getAutocompleteSuggestions(
  items: ContentItem[],
  query: string,
  limit: number = 8
): string[] {
  if (!query.trim()) {
    return [];
  }

  const normalizedQuery = normalizeText(query);
  const suggestions = new Set<string>();

  items.forEach((item) => {
    // Предложения из названий
    if (normalizeText(item.title).startsWith(normalizedQuery)) {
      suggestions.add(item.title);
    }

    // Предложения из жанров
    if (item.genres) {
      item.genres.forEach((genre) => {
        if (normalizeText(genre).startsWith(normalizedQuery)) {
          suggestions.add(genre);
        }
      });
    }
  });

  return Array.from(suggestions).slice(0, limit);
}

// Функция для получения популярных поисков
export function getPopularSearches(items: ContentItem[], limit: number = 5): string[] {
  const allGenres = new Map<string, number>();

  items.forEach((item) => {
    if (item.genres) {
      item.genres.forEach((genre) => {
        allGenres.set(genre, (allGenres.get(genre) || 0) + 1);
      });
    }
  });

  return Array.from(allGenres.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([genre]) => genre);
}

// Функция для фильтрации по жанрам
export function filterByGenres(items: ContentItem[], genres: string[]): ContentItem[] {
  if (genres.length === 0) {
    return items;
  }

  return items.filter((item) =>
    item.genres?.some((g) =>
      genres.some((filter) => normalizeText(g).includes(normalizeText(filter)))
    )
  );
}

// Функция для фильтрации по типу
export function filterByType(items: ContentItem[], type: 'movie' | 'series' | 'all'): ContentItem[] {
  if (type === 'all') {
    return items;
  }
  return items.filter((item) => item.type === type);
}

// Функция для фильтрации по году
export function filterByYear(items: ContentItem[], minYear: number, maxYear: number): ContentItem[] {
  return items.filter((item) => {
    if (!item.year) return true;
    return item.year >= minYear && item.year <= maxYear;
  });
}

// Функция для фильтрации по рейтингу
export function filterByRating(items: ContentItem[], minRating: number): ContentItem[] {
  return items.filter((item) => item.rating >= minRating);
}
