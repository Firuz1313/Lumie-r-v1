import { memo } from 'react';
import { BannerHero } from './BannerHero';
import { ContentRow } from './ContentRow';
import { RecommendationsSection } from './RecommendationsSection';
import { FilterPanel, type FilterState } from './FilterPanel';
import { cn } from '@/lib/utils';
import type { Block, HeroBannerBlock, ContentCarouselBlock, GridBlock, FeaturedCardBlock, DividerBlock, TextSectionBlock, FilterSectionBlock, RecommendationsBlock, TestimonialsBlock, CTASectionBlock, StatsBlock, FAQBlock } from '@/lib/blocks';
import type { ContentItem } from '@/lib/api';

interface BlockRendererProps {
  block: Block;
  allItems?: ContentItem[];
  onFilterChange?: (filters: FilterState) => void;
  className?: string;
}

export const BlockRenderer = memo(function BlockRenderer({
  block,
  allItems = [],
  onFilterChange,
  className,
}: BlockRendererProps) {
  if (block.hidden) {
    return null;
  }

  switch (block.type) {
    case 'hero-banner':
      return <HeroBannerBlock block={block as HeroBannerBlock} />;

    case 'content-carousel':
      return <ContentCarouselBlock block={block as ContentCarouselBlock} />;

    case 'grid':
      return <GridBlock block={block as GridBlock} />;

    case 'featured-card':
      return <FeaturedCardBlock block={block as FeaturedCardBlock} />;

    case 'divider':
      return <DividerBlockComponent block={block as DividerBlock} />;

    case 'text-section':
      return <TextSectionBlock block={block as TextSectionBlock} />;

    case 'filter-section':
      return (
        <FilterSectionBlock
          block={block as FilterSectionBlock}
          onFilterChange={onFilterChange}
        />
      );

    case 'recommendations':
      return <RecommendationsBlock block={block as RecommendationsBlock} allItems={allItems} />;

    case 'testimonials':
      return <TestimonialsBlockComponent block={block as TestimonialsBlock} />;

    case 'cta-section':
      return <CTASectionBlock block={block as CTASectionBlock} />;

    case 'stats':
      return <StatsBlockComponent block={block as StatsBlock} />;

    case 'faq':
      return <FAQBlock block={block as FAQBlock} />;

    default:
      return null;
  }
});

// Компонент для отображения hero баннера
function HeroBannerBlock({ block }: { block: HeroBannerBlock }) {
  return (
    <BannerHero
      type={block.variant || 'home'}
      items={block.items}
      title={block.title}
      subtitle={block.subtitle}
      backgroundImage={block.backgroundImage}
      showNav={block.showNav}
    />
  );
}

// Компонент для отображения карусели контента
function ContentCarouselBlock({ block }: { block: ContentCarouselBlock }) {
  return (
    <section className="relative py-6 animate-fade-in">
      <ContentRow
        title={block.title}
        items={block.items.slice(0, block.limit || block.items.length)}
        variant={block.variant || 'default'}
      />
    </section>
  );
}

// Компонент для отображения сетки
function GridBlock({ block }: { block: GridBlock }) {
  const columns = block.columns || 4;
  const gapClass = {
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
  }['medium'];

  return (
    <section className="relative py-6 animate-fade-in">
      <div className="container mx-auto px-4 lg:px-8">
        {block.title && (
          <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-6">
            {block.title}
          </h2>
        )}

        <div className={cn(
          'grid',
          `grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`,
          gapClass
        )}>
          {block.items.map((item) => (
            <a
              key={item.id}
              href={`/watch/${item.id}`}
              className="group relative block overflow-hidden rounded-xl aspect-[3/4] bg-card/60 border border-border/40"
            >
              <img
                src={item.poster}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <h3 className="text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// Компонент для отображения избранной карточки
function FeaturedCardBlock({ block }: { block: FeaturedCardBlock }) {
  return (
    <section className="relative py-12 animate-fade-in">
      <div className="container mx-auto px-4 lg:px-8">
        <a
          href={`/watch/${block.item.id}`}
          className="block group relative overflow-hidden rounded-2xl bg-card/60 border border-border/40"
        >
          <img
            src={block.item.backdrop || block.item.poster}
            alt={block.item.title}
            className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
          <div className="absolute inset-0 flex items-end p-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                {block.item.title}
              </h2>
              {block.item.description && (
                <p className="text-foreground/80 max-w-lg line-clamp-2">
                  {block.item.description}
                </p>
              )}
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}

// Компонент для отображения разделителя
function DividerBlockComponent({ block }: { block: DividerBlock }) {
  const spacingClass = {
    small: 'py-2',
    medium: 'py-6',
    large: 'py-12',
  }[block.spacing || 'medium'];

  const colorClass = {
    subtle: 'bg-border/10',
    default: 'bg-border/30',
    prominent: 'bg-border/60',
  }[block.color || 'default'];

  return (
    <div className={spacingClass}>
      <div className={cn('w-full h-px', colorClass)} />
    </div>
  );
}

// Компонент для отображения текстовой секции
function TextSectionBlock({ block }: { block: TextSectionBlock }) {
  const sizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[block.size || 'medium'];

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[block.alignment || 'left'];

  return (
    <section className="relative py-12 animate-fade-in">
      <div className="container mx-auto px-4 lg:px-8">
        <div className={cn('space-y-4 max-w-2xl', alignmentClass)}>
          {block.title && (
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
              {block.title}
            </h2>
          )}
          <div className={cn('text-foreground/80', sizeClass, 'leading-relaxed')}>
            {block.content}
          </div>
        </div>
      </div>
    </section>
  );
}

// Компонент для отображения фильтров
function FilterSectionBlock({
  block,
  onFilterChange,
}: {
  block: FilterSectionBlock;
  onFilterChange?: (filters: FilterState) => void;
}) {
  return (
    <section className="relative py-8 animate-fade-in">
      <div className="container mx-auto px-4 lg:px-8">
        <FilterPanel
          filters={{
            genres: [],
            types: ['movie', 'series'],
            minRating: 0,
            yearRange: [block.minYear || 1990, block.maxYear || new Date().getFullYear()],
            sortBy: 'relevance',
          }}
          onFilterChange={onFilterChange || (() => {})}
          availableGenres={block.availableGenres}
          minYear={block.minYear}
          maxYear={block.maxYear}
        />
      </div>
    </section>
  );
}

// Компонент для отображения рекомендаций
function RecommendationsBlock({
  block,
  allItems,
}: {
  block: RecommendationsBlock;
  allItems: ContentItem[];
}) {
  return (
    <RecommendationsSection
      allItems={allItems}
      title={block.title}
      limit={block.limit || 10}
      variant={block.variant || 'default'}
    />
  );
}

// Компонент для отображения отзывов
function TestimonialsBlockComponent({ block }: { block: TestimonialsBlock }) {
  return (
    <section className="relative py-12 animate-fade-in">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {block.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 rounded-lg bg-card/50 border border-border/30"
            >
              <p className="text-foreground/80 mb-4 italic">"{testimonial.text}"</p>
              <div className="flex items-center gap-3">
                {testimonial.avatar && (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  {testimonial.role && (
                    <p className="text-xs text-foreground/60">{testimonial.role}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Компонент для отображения CTA секции
function CTASectionBlock({ block }: { block: CTASectionBlock }) {
  return (
    <section className="relative py-16 animate-fade-in overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: block.backgroundImage
            ? `url(${block.backgroundImage})`
            : undefined,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-2xl space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            {block.title}
          </h2>
          {block.description && (
            <p className="text-foreground/80 text-lg">{block.description}</p>
          )}
          <div className="flex flex-wrap gap-4">
            {block.primaryButtonText && (
              <a
                href={block.primaryButtonLink || '#'}
                className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                {block.primaryButtonText}
              </a>
            )}
            {block.secondaryButtonText && (
              <a
                href={block.secondaryButtonLink || '#'}
                className="px-8 py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 font-semibold transition-colors"
              >
                {block.secondaryButtonText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Компонент для отображения статистики
function StatsBlockComponent({ block }: { block: StatsBlock }) {
  const columns = block.columns || 3;

  return (
    <section className="relative py-12 animate-fade-in">
      <div className="container mx-auto px-4 lg:px-8">
        <div className={cn(
          'grid gap-6',
          `grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`
        )}>
          {block.stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg bg-card/50 border border-border/30"
            >
              {stat.icon && (
                <div className="mb-3 flex justify-center text-3xl">
                  {stat.icon}
                </div>
              )}
              <p className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </p>
              <p className="text-foreground/70 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Компонент для отображения FAQ
function FAQBlock({ block }: { block: FAQBlock }) {
  return (
    <section className="relative py-12 animate-fade-in">
      <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
        {block.title && (
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-8">
            {block.title}
          </h2>
        )}

        <div className="space-y-4">
          {block.items.map((item, index) => (
            <details
              key={index}
              className="group rounded-lg border border-border/30 bg-card/50 p-4 cursor-pointer transition-colors hover:border-primary/50"
            >
              <summary className="flex items-center justify-between font-semibold text-foreground">
                {item.question}
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-4 text-foreground/70">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
