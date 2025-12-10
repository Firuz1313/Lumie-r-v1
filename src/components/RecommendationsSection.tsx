import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ContentRow } from './ContentRow';
import { getRecommendations, loadUserBehavior, getRelatedContent } from '@/lib/recommendations';
import type { ContentItem } from '@/lib/api';

interface RecommendationsSectionProps {
  allItems: ContentItem[];
  title?: string;
  limit?: number;
  variant?: 'default' | 'hero';
  relatedTo?: ContentItem;
}

export function RecommendationsSection({
  allItems,
  title = 'Рекомендовано для вас',
  limit = 10,
  variant = 'default',
  relatedTo,
}: RecommendationsSectionProps) {
  const [recommendedItems, setRecommendedItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    if (relatedTo) {
      // Показываем похожий контент
      const related = getRelatedContent(allItems, relatedTo, limit);
      setRecommendedItems(related);
    } else {
      // Показываем персональные рекомендации
      const behavior = loadUserBehavior();
      const recommendations = getRecommendations(allItems, behavior, limit);
      
      if (recommendations.length > 0) {
        setRecommendedItems(recommendations.map((r) => r.item));
      } else {
        // Если нет персональных рекомендаций, показываем популярное
        setRecommendedItems(
          allItems
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit)
        );
      }
    }
  }, [allItems, limit, relatedTo]);

  if (recommendedItems.length === 0) {
    return null;
  }

  return (
    <section className="relative py-6 animate-fade-in">
      <div className="container mx-auto px-4 lg:px-8 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl lg:text-2xl font-bold text-foreground">
            {title}
          </h2>
        </div>
      </div>
      
      <ContentRow
        title=""
        items={recommendedItems}
        variant={variant}
      />
    </section>
  );
}
