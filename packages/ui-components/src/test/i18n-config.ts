import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'en-US',
  whitelist: ['en-US'],
  load: 'currentOnly',
  resources: {
    'en-US': {
      translation: {},
    },
  },
  debug: false,
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
