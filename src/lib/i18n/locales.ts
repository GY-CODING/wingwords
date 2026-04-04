/**
 * Enum de idiomas soportados en WingWords.
 * Añade aquí nuevos idiomas y el script de compilación los detectará.
 */
export enum Locale {
  EN = 'en',
  ES = 'es',
  DE = 'de',
  FR = 'fr',
  PT = 'pt',
  GL = 'gl',
}

/** Array de todos los locales soportados (derivado del enum) */
export const SUPPORTED_LOCALES = Object.values(Locale) as Locale[];

/** Locale por defecto / fuente de verdad para los defaultMessage */
export const DEFAULT_LOCALE = Locale.EN;

/** Nombres completos para UI */
export const LOCALE_LABELS: Record<Locale, string> = {
  [Locale.EN]: 'English',
  [Locale.ES]: 'Español',
  [Locale.DE]: 'Deutsch',
  [Locale.FR]: 'Français',
  [Locale.PT]: 'Português',
  [Locale.GL]: 'Galego',
};

/** Clave de localStorage donde se persiste la preferencia */
export const LOCALE_STORAGE_KEY = 'wingwords-locale';
