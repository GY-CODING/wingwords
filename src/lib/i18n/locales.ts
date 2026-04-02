/**
 * Enum de idiomas soportados en WingWords.
 * Añade aquí nuevos idiomas y el script de compilación los detectará.
 */
export enum Locale {
  EN = 'en',
  ES = 'es',
  GL = 'gl',
  DE = 'de',
}

/** Array de todos los locales soportados (derivado del enum) */
export const SUPPORTED_LOCALES = Object.values(Locale) as Locale[];

/** Locale por defecto / fuente de verdad para los defaultMessage */
export const DEFAULT_LOCALE = Locale.EN;

/** Nombres completos para UI */
export const LOCALE_LABELS: Record<Locale, string> = {
  [Locale.EN]: 'English',
  [Locale.ES]: 'Español',
  [Locale.GL]: 'Galego',
  [Locale.DE]: 'Deutsch',
};

/** Flags emoji para el switcher */
export const LOCALE_FLAGS: Record<Locale, string> = {
  [Locale.EN]: '🇬🇧',
  [Locale.ES]: '🇪🇸',
  [Locale.GL]: '🏴',
  [Locale.DE]: '🇩🇪',
};

/** Clave de localStorage donde se persiste la preferencia */
export const LOCALE_STORAGE_KEY = 'wingwords-locale';
