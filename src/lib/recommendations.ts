import type { ContentItem } from './api';

export interface UserBehavior {
  viewedItems: string[];
  favoriteGenres: string[];
  favoritedItems: string[];
  lastViewed: string;
  viewedAt: Record<string, number>;
  ratingGiven: Record<string, number>;
}

export interface RecommendationScore {
  item: ContentItem;
  score: number;
  reason: string;
}

const STORAGE_KEY = 'user_behavior';

// Загрузить поведение пользователя из localStorage
export function loadUserBehavior(): UserBehavior {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return getDefaultUserBehavior();
    }
  }
  return getDefaultUserBehavior();
}

// Получить поведение пользователя по умолчанию
function getDefaultUserBehavior(): UserBehavior {
  return {
    viewedItems: [],
    favoriteGenres: [],
    favoritedItems: [],
    lastViewed: '',
    viewedAt: {},
    ratingGiven: {},
  };
}

// Сохранить поведение пользователя
export function saveUserBehavior(behavior: UserBehavior): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(behavior));
}

// Записать просмотр контента
export function trackViewedItem(itemId: string): void {
  const behavior = loadUserBehavior();
  
  if (!behavior.viewedItems.includes(itemId)) {
    behavior.viewedItems.push(itemId);
  }
  
  behavior.lastViewed = itemId;
  behavior.viewedAt[itemId] = Date.now();
  
  // Хранить максимум последние 100 просмотров
  if (behavior.viewedItems.length > 100) {
    behavior.viewedItems = behavior.viewedItems.slice(-100);
  }
  
  saveUserBehavior(behavior);
}

// Добавить жанр в избранные
export function addFavoriteGenre(genre: string): void {
  const behavior = loadUserBehavior();
  
  if (!behavior.favoriteGenres.includes(genre)) {
    behavior.favoriteGenres.push(genre);
  }
  
  saveUserBehavior(behavior);
}

// Добавить контент в избранное
export function addFavoritedItem(itemId: string): void {
  const behavior = loadUserBehavior();
  
  if (!behavior.favoritedItems.includes(itemId)) {
    behavior.favoritedItems.push(itemId);
  }
  
  saveUserBehavior(behavior);
}

// Удалить из избранного
export function removeFavoritedItem(itemId: string): void {
  const behavior = loadUserBehavior();
  behavior.favoritedItems = behavior.favoritedItems.filter((id) => id !== itemId);
  saveUserBehavior(behavior);
}

// Дать оценку контенту
export function rateItem(itemId: string, rating: number): void {
  const behavior = loadUserBehavior();
  behavior.ratingGiven[itemId] = Math.max(0, Math.min(10, rating));
  saveUserBehavior(behavior);
}

// Получить рекомендации на основе поведения пользователя
export function getRecommendations(
  items: ContentItem[],
  behavior?: UserBehavior,
  limit: number = 10
): RecommendationScore[] {
  const userBehavior = behavior || loadUserBehavior();
  const recommendations: RecommendationScore[] = [];

  items.forEach((item) => {
    // Исключить уже просмотренные и избранные
    if (
      userBehavior.viewedItems.includes(item.id) ||
      userBehavior.favoritedItems.includes(item.id)
    ) {
      return;
    }

    let score = 0;
    let reasons: string[] = [];

    // Бонус за совпадение жанров
    if (userBehavior.favoriteGenres.length > 0 && item.genres) {
      const matchingGenres = item.genres.filter((g) =>
        userBehavior.favoriteGenres.some(
          (fav) =>
            g.toLowerCase().includes(fav.toLowerCase()) ||
            fav.toLowerCase().includes(g.toLowerCase())
        )
      );

      if (matchingGenres.length > 0) {
        score += matchingGenres.length * 100;
        reasons.push(`${matchingGenres.length} совпадаю${matchingGenres.length > 1 ? 'т' : 'щийся'} жанр`);
      }
    }

    // Бонус за высокий рейтинг
    score += item.rating * 30;

    // Бонус за новые фильмы
    if (item.year && item.year >= new Date().getFullYear() - 1) {
      score += 50;
      reasons.push('Новый контент');
    }

    // Бонус за популярные фильмы (высокий рейтинг)
    if (item.rating >= 8) {
      score += 50;
      reasons.push('Популярный контент');
    }

    // Бонус за тип контента, если пользователь смотрел подобное
    if (userBehavior.viewedItems.length > 0) {
      const viewedItems = userBehavior.viewedItems;
      const similarTypeCount = viewedItems.length > 0 ? 1 : 0; // Упрощенная логика
      if (similarTypeCount > 0) {
        score += 20;
      }
    }

    if (score > 0) {
      recommendations.push({
        item,
        score,
        reason: reasons.length > 0 ? reasons.join(', ') : 'Рекомендовано',
      });
    }
  });

  // Сортируем по оценке
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// Получить рекомендации на основе последнего просмотра
export function getRelatedContent(
  items: ContentItem[],
  lastViewedItem: ContentItem | null,
  limit: number = 8
): ContentItem[] {
  if (!lastViewedItem) {
    return items.slice(0, limit);
  }

  const relatedItems: Array<{ item: ContentItem; similarity: number }> = [];

  items.forEach((item) => {
    if (item.id === lastViewedItem.id) return;

    let similarity = 0;

    // Совпадение жанров
    if (lastViewedItem.genres && item.genres) {
      const matchingGenres = lastViewedItem.genres.filter((g) =>
        item.genres!.includes(g)
      );
      similarity += matchingGenres.length * 50;
    }

    // Похожий год выпуска
    if (lastViewedItem.year && item.year) {
      const yearDiff = Math.abs(lastViewedItem.year - item.year);
      if (yearDiff <= 2) {
        similarity += 30;
      } else if (yearDiff <= 5) {
        similarity += 15;
      }
    }

    // Похожий рейтинг
    if (Math.abs(lastViewedItem.rating - item.rating) < 1) {
      similarity += 20;
    }

    // Такой же тип контента
    if (lastViewedItem.type === item.type) {
      similarity += 10;
    }

    if (similarity > 0) {
      relatedItems.push({ item, similarity });
    }
  });

  return relatedItems
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(({ item }) => item);
}

// Получить статистику пользователя
export function getUserStatistics(behavior?: UserBehavior): {
  totalViewed: number;
  favoriteGenres: string[];
  favoritedCount: number;
  avgRating: number;
} {
  const userBehavior = behavior || loadUserBehavior();
  const ratings = Object.values(userBehavior.ratingGiven);
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

  return {
    totalViewed: userBehavior.viewedItems.length,
    favoriteGenres: userBehavior.favoriteGenres,
    favoritedCount: userBehavior.favoritedItems.length,
    avgRating: parseFloat(avgRating.toFixed(1)),
  };
}
