/**
 * Vite-compatible translation loader.
 * Uses import.meta.glob (supported by both Vite builds and Vitest)
 * instead of the CJS require()-based @verdaccio/ui-i18n package.
 */
import enTranslations from './crowdin/ui.json';

const translationModules = import.meta.glob('./download_translations/*/ui.json', {
  eager: true,
  import: 'default',
});

export const DEFAULT_LANGUAGE = 'en-US';

export function loadTranslationFile(lng: string) {
  if (lng === DEFAULT_LANGUAGE) {
    return enTranslations;
  }
  const key = `./download_translations/${lng}/ui.json`;
  return (translationModules[key] as Record<string, string>) ?? enTranslations;
}

export default loadTranslationFile;
