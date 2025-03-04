import * as Flags from 'country-flag-icons/react/3x2';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import loadTranslation from '@verdaccio/ui-i18n';

const DEFAULT_LANGUAGE = 'en-US';

export const listLanguages = [
  { lng: DEFAULT_LANGUAGE, icon: Flags.US, menuKey: 'lng.english' },
  { lng: 'cs-CZ', icon: Flags.CZ, menuKey: 'lng.czech' },
  { lng: 'pt-BR', icon: Flags.BR, menuKey: 'lng.portuguese' },
  { lng: 'es-ES', icon: Flags.ES, menuKey: 'lng.spanish' },
  { lng: 'de-DE', icon: Flags.DE, menuKey: 'lng.german' },
];

const whitelist = listLanguages.reduce((acc, item) => {
  acc.push(item.lng);
  return acc;
}, [] as string[]);

const resources = listLanguages.reduce((acc, item) => {
  // Use English for all languages
  acc[item.lng] = { translation: loadTranslation(item.lng) };
  return acc;
}, {});

i18n.use(initReactI18next).init({
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  whitelist,
  load: 'currentOnly',
  react: {
    useSuspense: false,
  },
  resources,
  debug: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
