import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CollectionCard } from '@/components/CollectionCard';
import { fetchCollections, type Collection } from '@/lib/api';

const Collections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');

  const sortedCollections = useMemo(() => {
    return [...collections].sort((a, b) => sort === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
    );
  }, [collections, sort]);

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await fetchCollections();
        setCollections(data);
      } catch (error) {
        console.error('Ошибка загрузки коллекций:', error);
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

  const featuredCollection = collections[0];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero баннер - в стиле киносайта */}
      {featuredCollection && (
        <section className="relative h-[85vh] lg:h-[90vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: featuredCollection.image ? `url(${featuredCollection.image})` : undefined }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${featuredCollection.gradient} opacity-90`} />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
          </div>
          
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24 w-full">
              <div className="max-w-3xl space-y-4">
                <span className="inline-block px-3 py-1 text-xs font-bold uppercase bg-purple-500 text-white">
                  Коллекция
                </span>
                
                <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black text-white leading-tight drop-shadow-2xl">
                  {featuredCollection.name}
                </h1>
                
                <p className="text-white/90 text-base lg:text-lg max-w-2xl leading-relaxed">
                  Откройте для себя лучшие подборки контента, собранные специально для вас
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
      
      <main className="relative z-10 pt-12 lg:pt-16 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-sm text-foreground/70">Сортировка:</span>
            <div className="inline-flex rounded-lg border border-border/50 bg-card/60 overflow-hidden">
              <button
                onClick={() => setSort('asc')}
                className={`px-3 py-2 text-sm transition-colors ${sort === 'asc' ? 'bg-primary text-primary-foreground' : 'text-foreground/80 hover:bg-muted/50'}`}
              >
                А→Я
              </button>
              <button
                onClick={() => setSort('desc')}
                className={`px-3 py-2 text-sm transition-colors border-l border-border/40 ${sort === 'desc' ? 'bg-primary text-primary-foreground' : 'text-foreground/80 hover:bg-muted/50'}`}
              >
                Я→А
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-sm text-foreground/70">Сортировка:</span>
            <div className="inline-flex rounded-lg border border-border/50 bg-card/60 overflow-hidden">
              <button
                onClick={() => setSort('asc')}
                className={`px-3 py-2 text-sm transition-colors ${sort === 'asc' ? 'bg-primary text-primary-foreground' : 'text-foreground/80 hover:bg-muted/50'}`}
              >
                А→Я
              </button>
              <button
                onClick={() => setSort('desc')}
                className={`px-3 py-2 text-sm transition-colors border-l border-border/40 ${sort === 'desc' ? 'bg-primary text-primary-foreground' : 'text-foreground/80 hover:bg-muted/50'}`}
              >
                Я→А
              </button>
            </div>
          </div>
          
          {/* Сетка коллекций */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {sortedCollections.map((collection) => (
              <CollectionCard 
                key={collection.id} 
                collection={collection} 
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Collections;
