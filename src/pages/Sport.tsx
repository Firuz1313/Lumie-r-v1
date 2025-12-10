import { useEffect, useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { BannerHero } from '@/components/BannerHero';
import { Footer } from '@/components/Footer';
import { SportEventCard } from '@/components/SportEventCard';
import { fetchSportEvents, type SportEvent } from '@/lib/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function TeamBlock({ team, logo, align }: { team: string; logo?: string; align: 'left' | 'right' }) {
  return (
    <div className={`flex items-center gap-4 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
      {align === 'left' && (
        <div className="text-right">
          <div className="text-lg lg:text-2xl font-bold text-foreground">{team}</div>
        </div>
      )}
      <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-white/10 border border-white/30 backdrop-blur flex items-center justify-center overflow-hidden shadow-lg shadow-primary/20">
        {logo ? (
          <img src={logo} alt={team} className="w-16 h-16 object-contain" />
        ) : (
          <span className="text-2xl font-bold text-foreground/80">{team.charAt(0)}</span>
        )}
      </div>
      {align === 'right' && (
        <div>
          <div className="text-lg lg:text-2xl font-bold text-foreground">{team}</div>
        </div>
      )}
    </div>
  );
}

const Sport = () => {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroEvent, setHeroEvent] = useState<SportEvent | null>(null);
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  
  const popularRef = useRef<HTMLDivElement>(null);
  const tvRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        const eventsData = await fetchSportEvents();
        setEvents(eventsData);
        if (eventsData.length > 0) {
          setHeroEvent(eventsData.find(e => e.teams) || eventsData[0]);
        }
      } catch (error) {
        console.error('Ошибка загрузки контента:', error);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filteredEvents = showLiveOnly ? events.filter((e) => e.isLive) : events;
  const liveCount = events.filter(e => e.isLive).length;
  const heroBackground = heroEvent?.poster || "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=1600&h=900&fit=crop";

  return (
    <div className="min-h-screen">
      <Header />
      
      {heroEvent && (
        <BannerHero
          type="sport"
          sportEvent={heroEvent}
          showNav={false}
        />
      )}
      
      {/* Популярное сейчас */}
      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-foreground">Популярное сейчас</h2>
            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-full border border-border/50 bg-card/60 p-1 gap-1">
                {(['all','live'] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setShowLiveOnly(key === 'live')}
                    className={`px-4 py-2 text-sm rounded-full transition-colors ${(!showLiveOnly && key==='all') || (showLiveOnly && key==='live') ? 'bg-primary text-primary-foreground' : 'text-foreground/80 hover:bg-muted/60'}`}
                  >
                    {key === 'all' ? 'Все' : `LIVE (${liveCount})`}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => scroll(popularRef, 'left')}
                className="p-2 rounded-full bg-muted/50 hover:bg-muted text-foreground/60 hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scroll(popularRef, 'right')}
                className="p-2 rounded-full bg-muted/50 hover:bg-muted text-foreground/60 hover:text-foreground transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div 
            ref={popularRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredEvents.map((event) => (
              <div key={event.id} className="flex-shrink-0 w-[280px]">
                <SportEventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* ТВ Каналы */}
      <section className="py-8 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-foreground">ТВ - Каналы</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => scroll(tvRef, 'left')}
                className="p-2 rounded-full bg-muted/50 hover:bg-muted text-foreground/60 hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scroll(tvRef, 'right')}
                className="p-2 rounded-full bg-muted/50 hover:bg-muted text-foreground/60 hover:text-foreground transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div 
            ref={tvRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredEvents.map((event) => (
              <div key={`tv-${event.id}`} className="flex-shrink-0 w-[280px]">
                <SportEventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sport;
