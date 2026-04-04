/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import enMessages from '@/locales/en.json';
import esMessages from '@/locales/es.json';
import glMessages from '@/locales/gl.json';
import deMessages from '@/locales/de.json';
import frMessages from '@/locales/fr.json';
import ptMessages from '@/locales/pt.json';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
  type Locale,
} from './locales';

type Messages = Record<string, string>;

const ALL_MESSAGES: Record<Locale, Messages> = {
  en: enMessages,
  es: esMessages,
  gl: glMessages,
  de: deMessages,
  fr: frMessages,
  pt: ptMessages,
};

function resolveLocale(raw: string): Locale {
  const base = raw.split('-')[0] as Locale;
  return SUPPORTED_LOCALES.includes(base) ? base : DEFAULT_LOCALE;
}

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (id: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (id) => id,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    // 1. Preferencia guardada en localStorage
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
    if (stored && SUPPORTED_LOCALES.includes(stored)) {
      setLocaleState(stored);
      return;
    }
    // 2. Si no hay preferencia guardada, inglés por defecto
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
  }, []);

  const t = useCallback(
    (id: string, params?: Record<string, string | number>) => {
      const messages = ALL_MESSAGES[locale] ?? ALL_MESSAGES[DEFAULT_LOCALE];
      const msg = messages[id] ?? ALL_MESSAGES[DEFAULT_LOCALE][id] ?? id;
      if (!params) return msg;
      return msg.replace(/\{(\w+)\}/g, (_, key) =>
        String(params[key] ?? `{${key}}`)
      );
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

/** Hook para usar en componentes cliente */
export function useTranslation() {
  return useContext(I18nContext);
}
