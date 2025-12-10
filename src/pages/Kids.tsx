import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { BannerHero } from '@/components/BannerHero';
import { ContentRow } from '@/components/ContentRow';
import { Footer } from '@/components/Footer';
import { fetchKidsContent, fetchFreeContent, type ContentItem } from '@/lib/api';

const Kids = () => {
  const [kidsContent, setKidsContent] = useState<ContentItem[]>([]);
  const [freeContent, setFreeContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState<'all' | 'fun' | 'edu' | 'adventure'>('all');

  useEffect(() => {
    async function loadContent() {
      try {
        const [kidsData, freeData] = await Promise.all([
          fetchKidsContent(),
          fetchFreeContent(),
        ]);
        setKidsContent(kidsData);
        setFreeContent(freeData);
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
        type="kids"
        items={kidsContent}
        showNav={true}
      />
      
      {/* Контент секции */}
      <main className="relative z-10 pt-12 lg:pt-16 pb-16">
        <div className="container mx-auto px-4 lg:px-8 mb-6">
          <div className="inline-flex rounded-full border border-border/50 bg-card/60 p-1 gap-1">
            {([
              { key: 'all', label: 'Все' },
              { key: 'fun', label: 'Весёлые' },
              { key: 'edu', label: 'Обучающие' },
              { key: 'adventure', label: 'Приключения' },
            ] as const).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setMood(key)}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${mood === key ? 'bg-primary text-primary-foreground' : 'text-foreground/80 hover:bg-muted/60'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {(() => {
          const byMood = kidsContent.filter((item) => {
            if (mood === 'all') return true;
            const genres = item.genres?.join(' ').toLowerCase() || '';
            if (mood === 'fun') return genres.includes('комедия') || genres.includes('семей');
            if (mood === 'edu') return genres.includes('образоват') || genres.includes('документ');
            if (mood === 'adventure') return genres.includes('приключ') || genres.includes('фэнтези');
            return true;
          });
          
          return (
            <>
              <ContentRow 
                title="Бесплатно" 
                items={byMood} 
                variant="default" 
              />
              
              <ContentRow 
                title="Смотри вместе с родителями" 
                items={freeContent.slice(0, 6)} 
                variant="default" 
              />
              
              <ContentRow 
                title="Мультфильмы" 
                items={byMood.filter(item => item.genres?.includes('Мультфильм'))} 
                variant="default" 
              />
            </>
          );
        })()}
      </main>

      <Footer />
    </div>
  );
};

export default Kids;
