/**
 * @prettier
 */

import { addLocaleData } from 'react-intl';
import allLanguages from '../i18n/all.json';

// Split locales with a region code
const getRegionCode = locale => locale.toLowerCase().split(/[_-]+/)[0];

const localeData = Object.keys(allLanguages).map(key => {
  return require(`react-intl/locale-data/${getRegionCode(key)}`);
});

addLocaleData(localeData);

// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const envLanguage = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage;

// Split locales with a region code
export const locale = getRegionCode(envLanguage);

// // Try full locale, try locale without region code, fallback to 'en'
export const messages = allLanguages[locale] || allLanguages[envLanguage] || allLanguages.en;
