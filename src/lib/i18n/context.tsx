'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { translations, type Language, type TranslationKeys } from './translations';

interface I18nContextType {
  lang: Language;
  t: TranslationKeys;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children, defaultLang = 'en' }: { children: ReactNode; defaultLang?: Language }) {
  const [lang, setLang] = useState<Language>(defaultLang);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'ka' : 'en'));
  }, []);

  const t = translations[lang];

  return (
    <I18nContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
