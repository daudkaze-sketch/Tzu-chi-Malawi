'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Locale = 'en' | 'zh-TW';

const LocaleContext = createContext({
  locale: 'en' as Locale,
  setLocale: (l: Locale) => {},
  t: (path: string) => '',
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    try {
      const stored = localStorage.getItem('locale');
      return (stored as Locale) || 'en';
    } catch (e) {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('locale', locale);
    } catch (e) {}
  }, [locale]);

  const translations = useMemo(() => {
    // Lazy-load JSON files
    try {
      if (locale === 'zh-TW') return require('../locales/zh-TW.json');
      return require('../locales/en.json');
    } catch (e) {
      return require('../locales/en.json');
    }
  }, [locale]);

  const t = (path: string) => {
    const parts = path.split('.');
    // @ts-ignore
    let curr = translations;
    for (const p of parts) {
      if (!curr) return path;
      curr = curr[p];
    }
    return typeof curr === 'string' ? curr : path;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
