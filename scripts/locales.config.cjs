/**
 * Configuración centralizada de idiomas soportados en WingWords.
 *
 * Para añadir un nuevo idioma:
 *   1. Añádelo al array SUPPORTED_LOCALES
 *   2. Añade su nombre en localeNames y localeLabels
 *   3. Ejecuta npm run i18n:compile
 *      → crea el .json nuevo con traducciones automáticas por IA
 *
 * Equivale al enum Locale de src/lib/i18n/locales.ts
 */

const DEFAULT_LOCALE = 'en';
const SUPPORTED_LOCALES = ['en', 'es', 'gl', 'de', 'fr', 'pt'];

module.exports = {
  defaultLocale: DEFAULT_LOCALE,
  supportedLocales: SUPPORTED_LOCALES,

  get translationLocales() {
    return SUPPORTED_LOCALES.filter((l) => l !== DEFAULT_LOCALE);
  },

  /** Nombres en inglés (para prompts de IA) */
  localeNames: {
    en: 'English',
    es: 'Spanish',
    gl: 'Galician',
    de: 'German',
    fr: 'French',
    pt: 'Portuguese',
  },

  /** Etiquetas de UI (para logs) */
  localeLabels: {
    en: 'English',
    es: 'Español',
    gl: 'Galego',
    de: 'Deutsch',
    fr: 'Français',
    pt: 'Português',
  },
};
