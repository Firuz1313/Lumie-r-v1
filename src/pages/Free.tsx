import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { BannerHero } from '@/components/BannerHero';
import { ContentRow } from '@/components/ContentRow';
import { Footer } from '@/components/Footer';
import { fetchFreeContent, fetchPopular, type ContentItem } from '@/lib/api';

const Free = () => {
  const [freeContent, setFreeContent] = useState<ContentItem[]>([]);
  const [popular, setPopular] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'movie' | 'series'>('all');

  const filteredByType = useMemo(() => {
    const byType = filter === 'all' ? freeContent : freeContent.filter(item => item.type === filter);
    return {
      movies: byType.filter(item => item.type === 'movie'),
      series: byType.filter(item => item.type === 'series'),
    };
  }, [freeContent, filter]);

  useEffect(() => {
    async function loadContent() {
      try {
        const [freeData, popularData] = await Promise.all([
          fetchFreeContent(),
          fetchPopular(),
        ]);
        setFreeContent(freeData);
        setPopular(popularData);
      } catch (error) {
        console.error('Ошибка загрузки контента:', error);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <BannerHero
        type="free"
        items={freeContent.slice(0, 5)}
        showNav={true}
      />
      
      <main className="relative z-10 pt-12 lg:pt-16 pb-16">
        <div className="container mx-auto px-4 lg:px-8 mb-6">
          <div className="inline-flex rounded-full border border-border/50 bg-card/60 p-1 gap-1">
            {(['all','movie','series'] as const).map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${filter === key ? 'bg-primary text-primary-foreground' : 'text-foreground/80 hover:bg-muted/60'}`}
              >
                {key === 'all' ? 'Все' : key === 'movie' ? 'Фильмы' : 'Сериалы'}
              </button>
            ))}
          </div>
        </div>

        <ContentRow 
          title="Бесплатные фильмы" 
          items={filteredByType.movies} 
          variant="hero" 
        />
        
        <ContentRow 
          title="Бесплатные сериалы" 
          items={filteredByType.series} 
          variant="default" 
        />
        
        <ContentRow 
          title="Популярное бесплатно" 
          items={popular} 
          variant="default" 
        />
        
        <ContentRow 
          title="Документальные фильмы" 
          items={freeContent.filter(item => item.genres?.includes('Документальный'))} 
          variant="default" 
        />
      </main>

      <Footer />
    </div>
  );
};

export default Free;
