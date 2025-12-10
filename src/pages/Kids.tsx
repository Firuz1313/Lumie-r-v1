import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { ContentRow } from '@/components/ContentRow';
import { Footer } from '@/components/Footer';
import { fetchKidsContent, fetchFreeContent, type ContentItem } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';

const Kids = () => {
  const [kidsContent, setKidsContent] = useState<ContentItem[]>([]);
  const [freeContent, setFreeContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroItem, setHeroItem] = useState<ContentItem | null>(null);
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
        if (kidsData.length > 0) {
          setHeroItem(kidsData[0]);
        }
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
      
      {/* Hero секция для детей - в стиле киносайта */}
      {heroItem && (
        <section className="relative h-[85vh] lg:h-[90vh] overflow-hidden">
          {/* Фоновое изображение */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroItem.backdrop || heroItem.poster})` }}
          >
            {/* Градиенты для детского стиля - яркие цвета */}
            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/90 via-purple-900/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/50 to-transparent" />
          </div>
          
          {/* Контент */}
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24 w-full">
              <div className="max-w-3xl space-y-4">
                <Badge className="bg-pink-500 text-white px-3 py-1 text-xs font-bold uppercase">Для детей</Badge>
                
                <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black text-white leading-tight drop-shadow-2xl">
                  {heroItem.title}
                </h1>
                
                <div className="flex items-center gap-4 text-white/90 text-sm lg:text-base">
                  <span className="font-bold text-yellow-400">★ {heroItem.rating.toFixed(1)}</span>
                  {heroItem.year && <span>{heroItem.year}</span>}
                  {heroItem.duration && (
                    <>
                      <span className="text-white/60">•</span>
                      <span>{heroItem.duration}</span>
                    </>
                  )}
                  {heroItem.genres && (
                    <>
                      <span className="text-white/60">•</span>
                      <span>{heroItem.genres.slice(0, 2).join(', ')}</span>
                    </>
                  )}
                </div>
                
                {heroItem.description && (
                  <p className="text-white/90 text-base lg:text-lg max-w-2xl line-clamp-2 leading-relaxed">
                    {heroItem.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
      
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
