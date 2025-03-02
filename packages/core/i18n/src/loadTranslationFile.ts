/**
 * In development mode translations files might be not available,
 * crowdin translations are only available in CI.
 */
export function loadTranslationFile(lng) {
  try {
    return require(`./download_translations/${lng}/ui.json`);
  } catch {
    // eslint-disable-next-line no-console
    console.warn(`language ${lng} file not found, fallback to en-US`);
    // in case the file is not there, fallback to en-US
    return require(`./crowdin/ui.json`);
  }
}
