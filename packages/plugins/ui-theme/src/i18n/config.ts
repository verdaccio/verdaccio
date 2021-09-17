import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import {
  DEFAULT_LANGUAGE,
  LanguageConfiguration,
  listLanguages,
  listLanguagesAsString,
} from './enabledLanguages';

/**
 * In development mode translations files might be not available,
 * crowdin translations are only available in CI.
 */
function loadTranslationFile(lng) {
  try {
    return require(`./crowdin/${lng}/en-US.json`);
  } catch {
    // eslint-disable-next-line no-console
    console.error(`language ${lng} file not found, fallback to en-US`);
    // in case the file is not there, fallback to en-US
    return require(`./crowdin/en-US.json`);
  }
}

const languages = listLanguages.reduce((acc, item: LanguageConfiguration) => {
  acc[item.lng] = {
    translation:
      item.lng === DEFAULT_LANGUAGE
        ? require(`./crowdin/en-US.json`)
        : loadTranslationFile(item.lng),
  };
  return acc;
}, {});

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    // in case window.VEDACCIO_LANGUAGE is undefined,it will fall back to 'en-US'
    lng: window?.__VERDACCIO_BASENAME_UI_OPTIONS?.language || DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    whitelist: [...listLanguagesAsString],
    load: 'currentOnly',
    resources: languages,
    debug: false,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
