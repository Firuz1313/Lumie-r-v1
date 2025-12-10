import logoLumiere from '@/assets/logo-lumiere.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    about: [
      { label: 'О нас', href: '/about' },
      { label: 'Вакансии', href: '/jobs' },
      { label: 'Пресс-центр', href: '/press' },
      { label: 'Блог', href: '/blog' },
    ],
    support: [
      { label: 'Справка', href: '/help' },
      { label: 'Контакты', href: '/contacts' },
      { label: 'Обратная связь', href: '/feedback' },
    ],
    legal: [
      { label: 'Пользовательское соглашение', href: '/terms' },
      { label: 'Политика конфиденциальности', href: '/privacy' },
      { label: 'Правообладателям', href: '/copyright' },
    ],
  };

  return (
    <footer className="bg-lumiere-dark border-t border-border/30 py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Логотип и описание */}
          <div className="col-span-2 md:col-span-1">
            <img 
              src={logoLumiere} 
              alt="Lumière" 
              className="h-8 w-auto mb-4"
            />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Стриминговая платформа с лучшими фильмами и сериалами. Смотрите в любое время на любом устройстве.
            </p>
          </div>

          {/* О компании */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">О компании</h4>
            <ul className="space-y-2">
              {links.about.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Поддержка */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Поддержка</h4>
            <ul className="space-y-2">
              {links.support.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Юридическая информация */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Правовая информация</h4>
            <ul className="space-y-2">
              {links.legal.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Lumière. Все права защищены.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-xs">18+</span>
            <span className="text-muted-foreground text-xs">Возрастное ограничение</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
