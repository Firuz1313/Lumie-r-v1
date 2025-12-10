/**
 * A/B Testing system для динамических баннеров и контента
 * Позволяет тестировать разные версии элементов и отслеживать их производительность
 */

export interface ABTestVariant {
  id: string;
  name: string;
  description?: string;
  weight: number; // Вероятность выбора (0-100)
  config: Record<string, any>;
}

export interface ABTest {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  variants: ABTestVariant[];
  startDate: number;
  endDate?: number;
  metrics?: {
    views: Record<string, number>;
    clicks: Record<string, number>;
    conversions: Record<string, number>;
  };
}

export interface ABTestResult {
  testId: string;
  variantId: string;
  timestamp: number;
  userAgent: string;
  sessionId: string;
}

const STORAGE_KEY = 'ab_tests';
const RESULTS_KEY = 'ab_test_results';
const SESSION_KEY = 'ab_test_session';

/**
 * Получить уникальный идентификатор сессии
 */
export function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Создать новый AB тест
 */
export function createABTest(test: ABTest): void {
  const tests = getAllABTests();
  tests.push(test);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
}

/**
 * Получить все AB тесты
 */
export function getAllABTests(): ABTest[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Получить активный AB тест
 */
export function getActiveABTest(testId: string): ABTest | null {
  const tests = getAllABTests();
  const test = tests.find((t) => t.id === testId);

  if (!test || !test.active) {
    return null;
  }

  // Проверить дату окончания
  if (test.endDate && test.endDate < Date.now()) {
    test.active = false;
    updateABTest(test);
    return null;
  }

  return test;
}

/**
 * Выбрать вариант на основе веса
 */
export function selectVariant(test: ABTest | null): ABTestVariant | null {
  if (!test) {
    return null;
  }

  const totalWeight = test.variants.reduce((sum, v) => sum + v.weight, 0);
  const random = Math.random() * totalWeight;

  let cumulative = 0;
  for (const variant of test.variants) {
    cumulative += variant.weight;
    if (random <= cumulative) {
      return variant;
    }
  }

  return test.variants[0] || null;
}

/**
 * Записать результат AB теста
 */
export function recordABTestResult(testId: string, variantId: string): void {
  const result: ABTestResult = {
    testId,
    variantId,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    sessionId: getOrCreateSessionId(),
  };

  const results = getAllABTestResults();
  results.push(result);

  // Хранить максимум последние 1000 результатов
  if (results.length > 1000) {
    results.splice(0, results.length - 1000);
  }

  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));

  // Обновить метрики теста
  const tests = getAllABTests();
  const test = tests.find((t) => t.id === testId);

  if (test) {
    if (!test.metrics) {
      test.metrics = { views: {}, clicks: {}, conversions: {} };
    }

    test.metrics.views[variantId] = (test.metrics.views[variantId] || 0) + 1;
    updateABTest(test);
  }
}

/**
 * Записать клик по варианту
 */
export function recordABTestClick(testId: string, variantId: string): void {
  const tests = getAllABTests();
  const test = tests.find((t) => t.id === testId);

  if (test) {
    if (!test.metrics) {
      test.metrics = { views: {}, clicks: {}, conversions: {} };
    }

    test.metrics.clicks[variantId] = (test.metrics.clicks[variantId] || 0) + 1;
    updateABTest(test);
  }
}

/**
 * Записать конверсию
 */
export function recordABTestConversion(testId: string, variantId: string): void {
  const tests = getAllABTests();
  const test = tests.find((t) => t.id === testId);

  if (test) {
    if (!test.metrics) {
      test.metrics = { views: {}, clicks: {}, conversions: {} };
    }

    test.metrics.conversions[variantId] = (test.metrics.conversions[variantId] || 0) + 1;
    updateABTest(test);
  }
}

/**
 * Обновить AB тест
 */
export function updateABTest(updatedTest: ABTest): void {
  const tests = getAllABTests();
  const index = tests.findIndex((t) => t.id === updatedTest.id);

  if (index !== -1) {
    tests[index] = updatedTest;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
  }
}

/**
 * Удалить AB тест
 */
export function deleteABTest(testId: string): void {
  const tests = getAllABTests();
  const filtered = tests.filter((t) => t.id !== testId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Получить все результаты AB тестов
 */
export function getAllABTestResults(): ABTestResult[] {
  const stored = localStorage.getItem(RESULTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Получить статистику теста
 */
export function getABTestStats(testId: string): {
  testId: string;
  variants: Array<{
    variantId: string;
    name: string;
    views: number;
    clicks: number;
    conversions: number;
    ctr: number; // Click-through rate
    conversionRate: number;
  }>;
} | null {
  const test = getActiveABTest(testId);
  if (!test || !test.metrics) {
    return null;
  }

  const stats = {
    testId,
    variants: test.variants.map((variant) => ({
      variantId: variant.id,
      name: variant.name,
      views: test.metrics!.views[variant.id] || 0,
      clicks: test.metrics!.clicks[variant.id] || 0,
      conversions: test.metrics!.conversions[variant.id] || 0,
      ctr: 0,
      conversionRate: 0,
    })),
  };

  stats.variants.forEach((variant) => {
    variant.ctr = variant.views > 0 ? (variant.clicks / variant.views) * 100 : 0;
    variant.conversionRate = variant.views > 0 ? (variant.conversions / variant.views) * 100 : 0;
  });

  return stats;
}

/**
 * Найти лучший вариант
 */
export function findBestVariant(testId: string): ABTestVariant | null {
  const stats = getABTestStats(testId);
  if (!stats) {
    return null;
  }

  const test = getActiveABTest(testId);
  if (!test) {
    return null;
  }

  // Находим вариант с лучшей конверсией
  let bestVariantId = stats.variants[0]?.variantId;
  let bestConversionRate = stats.variants[0]?.conversionRate || 0;

  for (const variant of stats.variants) {
    if (variant.conversionRate > bestConversionRate) {
      bestConversionRate = variant.conversionRate;
      bestVariantId = variant.variantId;
    }
  }

  return test.variants.find((v) => v.id === bestVariantId) || null;
}

/**
 * Примеры конфигураций для AB тестов баннеров
 */

export const bannerABTestExample: ABTest = {
  id: 'banner-test-1',
  name: 'Главный баннер - Вариант A vs B',
  description: 'Тестирование разных цветовых схем и текста на главном баннере',
  active: true,
  startDate: Date.now(),
  variants: [
    {
      id: 'banner-variant-a',
      name: 'Вариант A - Традиционный',
      weight: 50,
      config: {
        backgroundColor: 'from-background via-background/60 to-transparent',
        textColor: 'text-white',
        titleSize: 'text-7xl',
        subtitle: 'Откройте для себя лучшие фильмы и сериалы',
      },
    },
    {
      id: 'banner-variant-b',
      name: 'Вариант B - Ярче',
      weight: 50,
      config: {
        backgroundColor: 'from-primary/20 via-background/60 to-transparent',
        textColor: 'text-white',
        titleSize: 'text-8xl',
        subtitle: 'Смотрите лучшее прямо сейчас',
      },
    },
  ],
};

/**
 * Hook для использования в компонентах
 */
export function useABTest(testId: string) {
  const test = getActiveABTest(testId);
  const variant = selectVariant(test);

  if (variant) {
    recordABTestResult(testId, variant.id);
  }

  return {
    variant,
    config: variant?.config || {},
    recordClick: () => {
      if (variant) {
        recordABTestClick(testId, variant.id);
      }
    },
    recordConversion: () => {
      if (variant) {
        recordABTestConversion(testId, variant.id);
      }
    },
  };
}
