import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationCS from './translations/cs-CZ.json';
import translationDE from './translations/de-DE.json';
import translationEN from './translations/en-US.json';
import translationES from './translations/es-ES.json';
import translationFR from './translations/fr-FR.json';
import translationJP from './translations/ja-JP.json';
import translationKM from './translations/km-KH.json';
import translationPT from './translations/pt-BR.json';
import translationRU from './translations/ru-RU.json';
import translationTR from './translations/tr-TR.json';
import translationUA from './translations/uk-UA.json';
import translationCN from './translations/zh-CN.json';
import translatiobTW from './translations/zh-TW.json';

const languages = {
  'en-US': {
    translation: translationEN,
  },
  'cs-CZ': {
    translation: translationCS,
  },
  'pt-BR': {
    translation: translationPT,
  },
  'es-ES': {
    translation: translationES,
  },
  'de-DE': {
    translation: translationDE,
  },
  'fr-FR': {
    translation: translationFR,
  },
  'zh-CN': {
    translation: translationCN,
  },
  'ja-JP': {
    translation: translationJP,
  },
  'ru-RU': {
    translation: translationRU,
  },
  'tr-TR': {
    translation: translationTR,
  },
  'uk-UA': {
    translation: translationUA,
  },
  'km-KH': {
    translation: translationKM,
  },
  'zh-TW': {
    translation: translatiobTW,
  },
};

type Language = keyof typeof languages;
i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    // in case window.VEDACCIO_LANGUAGE is undefined,it will fall back to 'en-US'
    lng: window?.__VERDACCIO_BASENAME_UI_OPTIONS?.language || 'en-US',
    fallbackLng: 'en-US',
    whitelist: [
      'en-US',
      'cs-CZ',
      'pt-BR',
      'es-ES',
      'de-DE',
      'fr-FR',
      'zh-CN',
      'ja-JP',
      'ru-RU',
      'tr-TR',
      'uk-UA',
      'km-KH',
      'zh-TW',
    ],
    load: 'currentOnly',
    resources: languages,
    debug: false,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
export { Language };
