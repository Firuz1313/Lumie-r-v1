import type { ContentItem } from './api';

/**
 * Модульная система блоков для сборки контента без ручной верстки
 * Каждый блок имеет тип, конфигурацию и опциональные данные
 */

export type BlockType =
  | 'hero-banner'
  | 'content-carousel'
  | 'grid'
  | 'featured-card'
  | 'divider'
  | 'text-section'
  | 'filter-section'
  | 'recommendations'
  | 'testimonials'
  | 'cta-section'
  | 'stats'
  | 'faq';

export interface BaseBlock {
  id: string;
  type: BlockType;
  hidden?: boolean;
}

export interface HeroBannerBlock extends BaseBlock {
  type: 'hero-banner';
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  items?: ContentItem[];
  height?: 'small' | 'medium' | 'large';
  variant?: 'home' | 'kids' | 'free' | 'sport' | 'collections' | 'tv';
  showNav?: boolean;
}

export interface ContentCarouselBlock extends BaseBlock {
  type: 'content-carousel';
  title: string;
  items: ContentItem[];
  variant?: 'default' | 'large' | 'hero';
  limit?: number;
}

export interface GridBlock extends BaseBlock {
  type: 'grid';
  title?: string;
  items: ContentItem[];
  columns?: number;
  gap?: 'small' | 'medium' | 'large';
}

export interface FeaturedCardBlock extends BaseBlock {
  type: 'featured-card';
  item: ContentItem;
  layout?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'large';
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
  spacing?: 'small' | 'medium' | 'large';
  color?: 'subtle' | 'default' | 'prominent';
}

export interface TextSectionBlock extends BaseBlock {
  type: 'text-section';
  title?: string;
  content: string;
  alignment?: 'left' | 'center' | 'right';
  size?: 'small' | 'medium' | 'large';
}

export interface FilterSectionBlock extends BaseBlock {
  type: 'filter-section';
  title?: string;
  availableGenres: string[];
  minYear?: number;
  maxYear?: number;
}

export interface RecommendationsBlock extends BaseBlock {
  type: 'recommendations';
  title?: string;
  limit?: number;
  variant?: 'default' | 'hero';
}

export interface TestimonialsBlock extends BaseBlock {
  type: 'testimonials';
  testimonials: Array<{
    text: string;
    author: string;
    role?: string;
    avatar?: string;
  }>;
  autoScroll?: boolean;
}

export interface CTASectionBlock extends BaseBlock {
  type: 'cta-section';
  title: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundImage?: string;
}

export interface StatsBlock extends BaseBlock {
  type: 'stats';
  stats: Array<{
    label: string;
    value: string | number;
    icon?: string;
  }>;
  columns?: number;
}

export interface FAQBlock extends BaseBlock {
  type: 'faq';
  title?: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
}

export type Block =
  | HeroBannerBlock
  | ContentCarouselBlock
  | GridBlock
  | FeaturedCardBlock
  | DividerBlock
  | TextSectionBlock
  | FilterSectionBlock
  | RecommendationsBlock
  | TestimonialsBlock
  | CTASectionBlock
  | StatsBlock
  | FAQBlock;

/**
 * Конфигурация страницы состоит из массива блоков
 * Каждый блок содержит всю необходимую информацию для его рендера
 */
export interface PageConfig {
  id: string;
  name: string;
  description?: string;
  blocks: Block[];
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    author?: string;
    version?: number;
  };
}

/**
 * Примеры конфигураций для разных страниц
 */

export const homePageConfig: PageConfig = {
  id: 'home',
  name: 'Главная страница',
  blocks: [
    {
      id: 'hero-1',
      type: 'hero-banner',
      title: 'Добро пожаловать в Lumière',
      subtitle: 'Откройте для себя лучшие фильмы и сериалы',
      variant: 'home',
      showNav: true,
      height: 'large',
    } as HeroBannerBlock,
    {
      id: 'carousel-1',
      type: 'content-carousel',
      title: 'Премьеры месяца',
      items: [],
      variant: 'hero',
    } as ContentCarouselBlock,
    {
      id: 'carousel-2',
      type: 'content-carousel',
      title: 'Популярное для вас',
      items: [],
      variant: 'default',
    } as ContentCarouselBlock,
    {
      id: 'divider-1',
      type: 'divider',
      spacing: 'medium',
    } as DividerBlock,
    {
      id: 'recommendations-1',
      type: 'recommendations',
      title: 'Рекомендовано для вас',
      limit: 10,
    } as RecommendationsBlock,
  ],
};

export const catalogPageConfig: PageConfig = {
  id: 'catalog',
  name: 'Каталог',
  blocks: [
    {
      id: 'hero-catalog',
      type: 'hero-banner',
      title: 'Найдите свой фильм',
      subtitle: 'Исследуйте тысячи фильмов, сериалов и шоу',
      variant: 'catalog',
      showNav: false,
      height: 'large',
    } as HeroBannerBlock,
    {
      id: 'filter-1',
      type: 'filter-section',
      title: 'Фильтры',
      availableGenres: ['Драма', 'Комедия', 'Экшен', 'Триллер', 'Романтика'],
    } as FilterSectionBlock,
    {
      id: 'grid-1',
      type: 'grid',
      title: 'Результаты',
      items: [],
      columns: 4,
    } as GridBlock,
  ],
};

/**
 * Вспомогательные функции для работы с блоками
 */

export function createBlock(type: BlockType, overrides: Partial<Block> = {}): Block {
  const id = `block-${Date.now()}`;

  const baseBlock: Block = {
    id,
    type,
    ...overrides,
  } as Block;

  return baseBlock;
}

export function updateBlock(blocks: Block[], blockId: string, updates: Partial<Block>): Block[] {
  return blocks.map((block) =>
    block.id === blockId ? { ...block, ...updates } : block
  );
}

export function removeBlock(blocks: Block[], blockId: string): Block[] {
  return blocks.filter((block) => block.id !== blockId);
}

export function reorderBlocks(blocks: Block[], fromIndex: number, toIndex: number): Block[] {
  const newBlocks = [...blocks];
  const [removed] = newBlocks.splice(fromIndex, 1);
  newBlocks.splice(toIndex, 0, removed);
  return newBlocks;
}

export function getVisibleBlocks(blocks: Block[]): Block[] {
  return blocks.filter((block) => !block.hidden);
}

export function toggleBlockVisibility(blocks: Block[], blockId: string): Block[] {
  return blocks.map((block) =>
    block.id === blockId ? { ...block, hidden: !block.hidden } : block
  );
}

/**
 * Валидация конфигурации
 */
export function validatePageConfig(config: PageConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.id) {
    errors.push('Config ID is required');
  }

  if (!config.blocks || config.blocks.length === 0) {
    errors.push('At least one block is required');
  }

  config.blocks.forEach((block, index) => {
    if (!block.id) {
      errors.push(`Block ${index} is missing an ID`);
    }

    if (!block.type) {
      errors.push(`Block ${block.id || index} is missing a type`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Сохранение и загрузка конфигурации
 */
export function savePageConfig(config: PageConfig): void {
  const validation = validatePageConfig(config);
  if (!validation.valid) {
    throw new Error(`Invalid page config: ${validation.errors.join(', ')}`);
  }

  const key = `page-config-${config.id}`;
  localStorage.setItem(key, JSON.stringify(config));
}

export function loadPageConfig(pageId: string): PageConfig | null {
  const key = `page-config-${pageId}`;
  const stored = localStorage.getItem(key);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as PageConfig;
  } catch {
    return null;
  }
}

export function deletePageConfig(pageId: string): void {
  const key = `page-config-${pageId}`;
  localStorage.removeItem(key);
}
