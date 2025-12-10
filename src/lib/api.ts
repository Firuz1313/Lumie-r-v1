/**
 * API-сервис для подключения к бэкенду Ant-Lumiere
 * Базовый URL: http://ant-tv.ddns.net:2223
 * Авторизация: admin/content
 */

// Конфигурация API
const API_BASE_URL = 'http://ant-tv.ddns.net:2223';
const API_CREDENTIALS = {
  username: 'admin',
  password: 'content',
};

// Типы данных контента
export interface ContentItem {
  id: string;
  title: string;
  type: 'movie' | 'series';
  rating: number;
  poster: string;
  backdrop?: string;
  year?: number;
  duration?: string;
  description?: string;
  genres?: string[];
  qualities?: string[];
  audioTracks?: string[];
  subtitles?: string[];
  trailerUrl?: string;
  streamUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  items: ContentItem[];
}

export interface Playlist {
  id: string;
  name: string;
  items: ContentItem[];
}

// Моковые данные для разработки (заменить на реальные API вызовы)
export const mockPremiers: ContentItem[] = [
  {
    id: '1',
    title: 'Питерские каникулы',
    type: 'movie',
    rating: 8.1,
    poster: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=1200&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1920&h=1080&fit=crop',
    year: 2024,
    genres: ['Драма', 'Романтика'],
  },
  {
    id: '2',
    title: 'СВОИ',
    type: 'movie',
    rating: 8.1,
    poster: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=1200&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1920&h=1080&fit=crop',
    year: 2024,
    genres: ['Военный', 'Драма'],
  },
  {
    id: '3',
    title: 'Тайна ночи',
    type: 'movie',
    rating: 7.8,
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=1200&fit=crop',
    year: 2024,
    genres: ['Триллер', 'Детектив'],
  },
];

export const mockPopular: ContentItem[] = [
  {
    id: '4',
    title: 'Роднина',
    type: 'series',
    rating: 8.1,
    poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop',
    year: 2024,
    genres: ['Драма'],
  },
  {
    id: '5',
    title: 'Постучись в мою дверь 2',
    type: 'series',
    rating: 8.1,
    poster: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=600&fit=crop',
    year: 2024,
    genres: ['Романтика'],
  },
  {
    id: '6',
    title: 'Таня и Космонавт',
    type: 'series',
    rating: 8.1,
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop',
    year: 2024,
    genres: ['Комедия', 'Романтика'],
  },
  {
    id: '7',
    title: 'Чумовая пятница 2',
    type: 'series',
    rating: 8.1,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
    year: 2024,
    genres: ['Комедия'],
  },
  {
    id: '8',
    title: 'Зверобой',
    type: 'series',
    rating: 8.0,
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
    year: 2024,
    genres: ['Экшен', 'Приключения'],
  },
];

// Моковые данные для детского контента
export const mockKidsContent: ContentItem[] = [
  {
    id: 'k1',
    title: 'Лунтик и его друзья',
    type: 'series',
    rating: 8.5,
    poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop',
    year: 2021,
    duration: '21 минут',
    genres: ['Мультфильм', 'Семейный'],
    description: '«Лунтик и его друзья» — российский мультсериал, ориентированный на общую аудиторию.',
  },
  {
    id: 'k2',
    title: 'Маша и Медведь',
    type: 'series',
    rating: 8.3,
    poster: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=600&fit=crop',
    year: 2023,
    genres: ['Мультфильм', 'Комедия'],
  },
  {
    id: 'k3',
    title: 'Winx Club',
    type: 'series',
    rating: 7.9,
    poster: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&h=600&fit=crop',
    year: 2022,
    genres: ['Мультфильм', 'Фэнтези'],
  },
  {
    id: 'k4',
    title: 'Смурфики',
    type: 'movie',
    rating: 7.5,
    poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=600&fit=crop',
    year: 2023,
    genres: ['Мультфильм', 'Приключения'],
  },
  {
    id: 'k5',
    title: 'Барби: Приключения',
    type: 'movie',
    rating: 7.2,
    poster: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop',
    year: 2024,
    genres: ['Мультфильм', 'Приключения'],
  },
];

// Моковые данные для бесплатного контента
export const mockFreeContent: ContentItem[] = [
  {
    id: 'f1',
    title: 'Документальный фильм',
    type: 'movie',
    rating: 8.0,
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
    year: 2024,
    genres: ['Документальный'],
  },
  {
    id: 'f2',
    title: 'Классика кино',
    type: 'movie',
    rating: 9.1,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
    year: 1994,
    genres: ['Драма', 'Классика'],
  },
  ...mockPopular,
];

// Интерфейс для спортивных событий
export interface SportEvent {
  id: string;
  title: string;
  teams?: { home: string; away: string; homeLogo?: string; awayLogo?: string };
  league: string;
  date: string;
  time: string;
  poster?: string;
  isLive?: boolean;
  channel?: string;
}

// Моковые данные для спорта
export const mockSportEvents: SportEvent[] = [
  {
    id: 's1',
    title: 'Chelsea - Real Madrid',
    teams: { 
      home: 'Chelsea', 
      away: 'Real Madrid',
      homeLogo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
      awayLogo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
    },
    league: 'UEFA Champions League',
    date: 'Сегодня',
    time: '17:20',
    isLive: true,
    poster: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600&h=900&fit=crop',
  },
  {
    id: 's2',
    title: 'UFC: Махачев - Мадалена',
    league: 'UFC',
    date: '27 Ноября',
    time: '11:10',
    poster: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&h=300&fit=crop',
  },
  {
    id: 's3',
    title: 'Tottenham - Liverpool',
    teams: { 
      home: 'Tottenham', 
      away: 'Liverpool',
      homeLogo: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
      awayLogo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
    },
    league: 'Premier League',
    date: '3 Декабря',
    time: '16:40',
    poster: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1600&h=900&fit=crop',
  },
  {
    id: 's4',
    title: 'Manchester UN - Chelsea',
    teams: { 
      home: 'Manchester UN', 
      away: 'Chelsea',
      homeLogo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
      awayLogo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
    },
    league: 'Premier League',
    date: '3 Декабря',
    time: '18:30',
    poster: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1600&h=900&fit=crop',
  },
];

// Интерфейс для коллекций
export interface Collection {
  id: string;
  name: string;
  slug: string;
  gradient: string;
  icon?: string;
  image?: string;
}

// Моковые данные для коллекций
export const mockCollections: Collection[] = [
  { id: 'c1', name: 'Фильмы', slug: 'movies', gradient: 'from-red-600 to-pink-600', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=300&fit=crop' },
  { id: 'c2', name: 'Сериалы', slug: 'series', gradient: 'from-purple-600 to-pink-500', image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=300&fit=crop' },
  { id: 'c3', name: 'Шоу', slug: 'shows', gradient: 'from-slate-600 to-slate-700', image: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400&h=300&fit=crop' },
  { id: 'c4', name: 'Популярные фильмы', slug: 'popular-movies', gradient: 'from-yellow-500 to-orange-500' },
  { id: 'c5', name: 'Приключения', slug: 'adventures', gradient: 'from-fuchsia-500 to-purple-600' },
  { id: 'c6', name: 'Популярные сериалы', slug: 'popular-series', gradient: 'from-cyan-500 to-blue-600' },
  { id: 'c7', name: 'Спорт', slug: 'sport', gradient: 'from-green-500 to-emerald-600' },
  { id: 'c8', name: 'Документальные', slug: 'documentary', gradient: 'from-indigo-500 to-violet-600' },
  { id: 'c9', name: 'Для детей', slug: 'kids', gradient: 'from-orange-400 to-amber-500' },
];

// Интерфейс для ТВ каналов
export interface TVChannel {
  id: string;
  name: string;
  logo?: string;
  category: string;
  currentProgram?: string;
}

// Моковые данные для ТВ каналов
export const mockTVChannels: TVChannel[] = [
  { id: 'tv1', name: 'Первый канал', category: 'Общие', currentProgram: 'Новости' },
  { id: 'tv2', name: 'Россия 1', category: 'Общие', currentProgram: 'Вести' },
  { id: 'tv3', name: 'НТВ', category: 'Общие', currentProgram: 'Сегодня' },
  { id: 'tv4', name: 'Матч ТВ', category: 'Спорт', currentProgram: 'Футбол' },
  { id: 'tv5', name: 'Карусель', category: 'Детские', currentProgram: 'Мультфильмы' },
  { id: 'tv6', name: 'Культура', category: 'Общие', currentProgram: 'Документальный фильм' },
];

// API функции (заглушки для подключения к реальному бэкенду)
export async function fetchPremiers(): Promise<ContentItem[]> {
  // TODO: Заменить на реальный API вызов
  return Promise.resolve(mockPremiers);
}

export async function fetchPopular(): Promise<ContentItem[]> {
  // TODO: Заменить на реальный API вызов
  return Promise.resolve(mockPopular);
}

export async function fetchKidsContent(): Promise<ContentItem[]> {
  return Promise.resolve(mockKidsContent);
}

export async function fetchFreeContent(): Promise<ContentItem[]> {
  return Promise.resolve(mockFreeContent);
}

export async function fetchSportEvents(): Promise<SportEvent[]> {
  return Promise.resolve(mockSportEvents);
}

export async function fetchCollections(): Promise<Collection[]> {
  return Promise.resolve(mockCollections);
}

export async function fetchTVChannels(): Promise<TVChannel[]> {
  return Promise.resolve(mockTVChannels);
}

export async function fetchContentById(id: string): Promise<ContentItem | null> {
  // TODO: Заменить на реальный API вызов
  const allContent = [...mockPremiers, ...mockPopular, ...mockKidsContent, ...mockFreeContent];
  return Promise.resolve(allContent.find(item => item.id === id) || null);
}

export async function fetchCategories(): Promise<Category[]> {
  // TODO: Заменить на реальный API вызов
  return Promise.resolve([
    { id: '1', name: 'Фильмы', slug: 'movies', items: mockPremiers },
    { id: '2', name: 'Сериалы', slug: 'series', items: mockPopular },
  ]);
}

export async function searchContent(query: string): Promise<ContentItem[]> {
  const allContent = [...mockPremiers, ...mockPopular, ...mockKidsContent, ...mockFreeContent];
  return Promise.resolve(
    allContent.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    )
  );
}

// Функция для получения всего контента
export function getAllContent(): ContentItem[] {
  return [...mockPremiers, ...mockPopular, ...mockKidsContent, ...mockFreeContent];
}
