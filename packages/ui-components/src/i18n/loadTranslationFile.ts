import enTranslations from './crowdin/ui.json';

// Crowdin downloads land here before the build, so the bundle carries every available language.
const translationModules = import.meta.glob<Record<string, unknown>>(
  './download_translations/*/ui.json',
  { eager: true, import: 'default' }
);

export const DEFAULT_TRANSLATION_LANGUAGE = 'en-US';

/**
 * Returns the translated UI strings for a language. Missing or empty keys (or a language that
 * was not downloaded) fall back to English through i18next.
 */
export function loadTranslationFile(lng: string): Record<string, unknown> {
  if (lng === DEFAULT_TRANSLATION_LANGUAGE) {
    return enTranslations;
  }
  return translationModules[`./download_translations/${lng}/ui.json`] ?? {};
}
