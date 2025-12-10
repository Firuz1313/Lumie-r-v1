import { useState } from 'react';
import { Search, Menu, Home, Smile, Gift, Dumbbell, Grid3X3, Tv } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoLumiere from '@/assets/logo-lumiere.png';
import { Button } from '@/components/ui/button';
import { SearchModal } from './SearchModal';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Главная', href: '/' },
  { icon: Smile, label: 'Детям', href: '/kids' },
  { icon: Gift, label: 'Бесплатно', href: '/free' },
  { icon: Dumbbell, label: 'Спорт', href: '/sport' },
  { icon: Grid3X3, label: 'Коллекции', href: '/collections' },
  { icon: Tv, label: 'ТВ каналы', href: '/tv' },
];

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Логотип и левая навигация */}
            <div className="flex items-center gap-6 lg:gap-8">
              {/* Лого */}
              <a href="/" className="flex-shrink-0">
                <img 
                  src={logoLumiere} 
                  alt="Lumière" 
                  className="h-8 lg:h-10 w-auto"
                />
              </a>

              {/* Каталог */}
              <button 
                onClick={() => navigate('/catalog')}
                className="hidden md:flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors"
              >
                <Menu className="w-5 h-5" />
                <span className="text-sm font-medium">Каталог</span>
              </button>

            {/* Поиск */}
            <button 
              className="hidden md:flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="w-5 h-5" />
              <span className="text-sm">Поиск</span>
            </button>
          </div>

          {/* Центральная навигация */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors",
                    isActive 
                      ? "text-primary" 
                      : "text-foreground/60 hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Правая часть */}
          <div className="flex items-center gap-3">
            {/* Промо кнопка */}
            <Button 
              variant="outline" 
              className="hidden sm:flex bg-primary/20 border-primary/50 text-primary hover:bg-primary/30 hover:border-primary text-sm font-medium px-4"
            >
              15 смн за 30 дней
            </Button>

            {/* Кнопка входа */}
            <Button 
              variant="outline"
              className="border-foreground/30 text-foreground hover:bg-foreground/10 hover:border-foreground/50 text-sm font-medium px-6"
            >
              Войти
            </Button>

            {/* Мобильное меню */}
            <button className="lg:hidden p-2 text-foreground/60 hover:text-foreground">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      </header>

      {/* Модальное окно поиска */}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
