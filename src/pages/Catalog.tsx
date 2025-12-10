import { useMemo, useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { CategoryCard } from '@/components/CategoryCard';
import { ContentRow } from '@/components/ContentRow';
import { mockPremiers, mockPopular } from '@/lib/api';

// Категории с изображениями
const categories = [
  {
    id: 'movies',
    title: 'Фильмы',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=300&fit=crop',
    href: '/catalog/movies',
    color: 'bg-destructive/40',
  },
  {
    id: 'series',
    title: 'Сериалы',
    image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=300&fit=crop',
    href: '/catalog/series',
    color: 'bg-primary/40',
  },
  {
    id: 'shows',
    title: 'Шоу',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop',
    href: '/catalog/shows',
    color: 'bg-accent/40',
  },
  {
    id: 'cartoons',
    title: 'Мультики',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop',
    href: '/catalog/cartoons',
    color: 'bg-secondary/40',
  },
];

export default function Catalog() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((c) => c.title.toLowerCase().includes(term));
  }, [search]);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero баннер - в стиле киносайта */}
      <section className="relative h-[85vh] lg:h-[90vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
        </div>
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24 w-full">
            <div className="max-w-3xl space-y-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Назад</span>
              </button>
              
              <span className="inline-block px-3 py-1 text-xs font-bold uppercase bg-primary text-primary-foreground">
                Каталог
              </span>
              
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black text-white leading-tight drop-shadow-2xl">
                Найдите свой фильм
              </h1>
              
              <p className="text-white/90 text-base lg:text-lg max-w-2xl leading-relaxed">
                Исследуйте тысячи фильмов, сериалов и шоу в нашем каталоге
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Контент */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 space-y-10 pt-12 lg:pt-16 pb-16">
        {/* Категории */}
        <section>
          <div className="flex flex-col gap-3 mb-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-xl font-semibold text-foreground">Категории</h2>
            <label className="flex items-center gap-2 rounded-lg bg-card/70 border border-border/40 px-3 py-2 focus-within:border-primary/60 transition-colors">
              <Search className="w-4 h-4 text-foreground/60" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск категории"
                className="bg-transparent outline-none text-sm text-foreground placeholder:text-foreground/50"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                title={category.title}
                image={category.image}
                href={category.href}
                color={category.color}
              />
            ))}
            {filteredCategories.length === 0 && (
              <p className="col-span-full text-sm text-foreground/60">Ничего не найдено</p>
            )}
          </div>
        </section>

        {/* Ряды контента */}
        <ContentRow title="Популярные фильмы и сериалы" items={mockPremiers} />
        <ContentRow title="Популярное для вас" items={mockPopular} />
      </div>
    </main>
  );
}
