import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { ContentRow } from '@/components/ContentRow';
import { Footer } from '@/components/Footer';
import { fetchPremiers, fetchPopular, type ContentItem } from '@/lib/api';

const Index = () => {
  const [premiers, setPremiers] = useState<ContentItem[]>([]);
  const [popular, setPopular] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных с API
  useEffect(() => {
    async function loadContent() {
      try {
        const [premiersData, popularData] = await Promise.all([
          fetchPremiers(),
          fetchPopular(),
        ]);
        setPremiers(premiersData);
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
      {/* Шапка сайта */}
      <Header />
      
      {/* Главный баннер */}
      <HeroSection items={premiers} />
      
      {/* Секции контента */}
      <main className="relative z-10 pt-12 lg:pt-16 pb-16">
        {/* Премьеры месяца */}
        <ContentRow 
          title="Премьеры месяца" 
          items={premiers} 
          variant="hero" 
        />
        
        {/* Популярное для вас */}
        <ContentRow 
          title="Популярное для вас" 
          items={popular} 
          variant="default" 
        />
        
        {/* Сериалы */}
        <ContentRow 
          title="Лучшие сериалы" 
          items={popular.filter(item => item.type === 'series')} 
          variant="default" 
        />
        
        {/* Фильмы */}
        <ContentRow 
          title="Новые фильмы" 
          items={premiers.filter(item => item.type === 'movie')} 
          variant="default" 
        />
      </main>

      {/* Футер */}
      <Footer />
    </div>
  );
};

export default Index;
