import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import {
  DEFAULT_LANGUAGE,
  LanguageConfiguration,
  listLanguages,
  listLanguagesAsString,
} from './enabledLanguages';
import { loadTranslationFile } from './loadTranslationFile';

const languages = listLanguages.reduce((acc, item: LanguageConfiguration) => {
  acc[item.lng] = {
    translation:
      item.lng === DEFAULT_LANGUAGE ? require(`./crowdin/ui.json`) : loadTranslationFile(item.lng),
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
    react: {
      useSuspense: false,
    },
    resources: languages,
    debug: false,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
