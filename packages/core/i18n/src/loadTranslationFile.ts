import enTranslations from './crowdin/ui.json';

export const DEFAULT_LANGUAGE = 'en-US';

/**
 * In development mode translations files might be not available,
 * crowdin translations are only available in CI.
 *
 * Uses typeof require guard so this file works in both Node/CJS (Babel build)
 * and Vite/ESM contexts (Storybook), where require is not defined.
 */
export function loadTranslationFile(lng: string): Record<string, string> {
  if (lng === DEFAULT_LANGUAGE) {
    return enTranslations as unknown as Record<string, string>;
  }

  if (typeof require !== 'undefined') {
    try {
      return require(`./download_translations/${lng}/ui.json`);
    } catch {
      // fall through to default
    }
  }
  console.warn(`language ${lng} file not found, fallback to en-US`);
  return enTranslations as unknown as Record<string, string>;
}
