import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { BannerHero } from '@/components/BannerHero';
import { Footer } from '@/components/Footer';
import { fetchTVChannels, type TVChannel } from '@/lib/api';
import { Tv, Play, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TVChannelCardProps {
  channel: TVChannel;
}

function TVChannelCard({ channel }: TVChannelCardProps) {
  return (
    <a
      href={`/tv/${channel.id}`}
      className={cn(
        "group block rounded-xl overflow-hidden transition-all duration-300 bg-card/50 border border-border/30",
        "hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30"
      )}
    >
      {/* Превью канала */}
      <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative">
        <Tv className="w-12 h-12 text-foreground/30" />
        
        {/* Кнопка воспроизведения */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-6 h-6 text-primary-foreground fill-current ml-1" />
          </div>
        </div>
      </div>
      
      {/* Информация о канале */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
          {channel.name}
        </h3>
        {channel.currentProgram && (
          <p className="text-sm text-foreground/60">
            Сейчас: {channel.currentProgram}
          </p>
        )}
        <span className="inline-block mt-2 text-xs text-primary bg-primary/20 px-2 py-1 rounded">
          {channel.category}
        </span>
      </div>
    </a>
  );
}

const TVChannels = () => {
  const [channels, setChannels] = useState<TVChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await fetchTVChannels();
        setChannels(data);
      } catch (error) {
        console.error('Ошибка загрузки ТВ каналов:', error);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  // Получаем уникальные категории
  const categories = ['all', ...new Set(channels.map(ch => ch.category))];
  
  // Фильтруем каналы
  const filteredChannels = useMemo(() => {
    const byCategory = activeCategory === 'all' 
      ? channels 
      : channels.filter(ch => ch.category === activeCategory);
    const term = search.trim().toLowerCase();
    if (!term) return byCategory;
    return byCategory.filter(ch => 
      ch.name.toLowerCase().includes(term) ||
      (ch.currentProgram?.toLowerCase().includes(term) ?? false)
    );
  }, [activeCategory, channels, search]);

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
        type="tv"
        title="ТВ каналы"
        subtitle="Смотрите любимые телеканалы в прямом эфире в любое время"
        backgroundImage="https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1920&h=1080&fit=crop"
        showNav={false}
      />
      
      <main className="relative z-10 pt-12 lg:pt-16 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          
          {/* Фильтр по категориям + поиск */}
          <div className="flex flex-wrap gap-3 mb-8 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    activeCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-foreground/70 hover:bg-muted hover:text-foreground"
                  )}
                >
                  {category === 'all' ? 'Все каналы' : category}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 rounded-lg bg-card/70 border border-border/40 px-3 py-2 focus-within:border-primary/60 transition-colors">
              <Search className="w-4 h-4 text-foreground/60" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск канала или программы"
                className="bg-transparent outline-none text-sm text-foreground placeholder:text-foreground/50"
              />
            </label>
          </div>
          
          {/* Сетка каналов */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {filteredChannels.map((channel) => (
              <TVChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TVChannels;
