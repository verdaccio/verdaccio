import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// NOTE: not used yet, but should replace the original implementation

// https://react.i18next.com/misc/testing#testing-without-stubbing

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',

  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',

  debug: false,

  interpolation: {
    escapeValue: false, // not needed for react!!
  },

  resources: { en: { translations: {} } },
});

export default i18n;
