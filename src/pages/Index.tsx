import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { BannerHero } from '@/components/BannerHero';
import { ContentRow } from '@/components/ContentRow';
import { Footer } from '@/components/Footer';
import { fetchPremiers, fetchPopular, type ContentItem } from '@/lib/api';

const Index = () => {
  const [premiers, setPremiers] = useState<ContentItem[]>([]);
  const [popular, setPopular] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

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
      <Header />

      <BannerHero
        type="home"
        items={premiers}
        showNav={true}
      />

      <main className="relative z-10 pt-12 lg:pt-16 pb-16">
        <ContentRow
          title="Премьеры месяца"
          items={premiers}
          variant="hero"
        />

        <ContentRow
          title="Популярное для вас"
          items={popular}
          variant="default"
        />

        <ContentRow
          title="Лучшие сериалы"
          items={popular.filter(item => item.type === 'series')}
          variant="default"
        />

        <ContentRow
          title="Новые фильмы"
          items={premiers.filter(item => item.type === 'movie')}
          variant="default"
        />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
