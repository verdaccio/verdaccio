import Flags from 'country-flag-icons/react/3x2';

export const DEFAULT_LANGUAGE = 'en-US';

export type LanguageConfiguration = {
  lng: string;
  menuKey: string;
  icon: Flags.FlagComponent;
};

export const listLanguages: LanguageConfiguration[] = [
  { lng: DEFAULT_LANGUAGE, icon: Flags.US, menuKey: 'lng.english' },
  { lng: 'cs-CZ', icon: Flags.CZ, menuKey: 'lng.czech' },
  { lng: 'pt-BR', icon: Flags.BR, menuKey: 'lng.portuguese' },
  { lng: 'es-ES', icon: Flags.ES, menuKey: 'lng.spanish' },
  { lng: 'ga-IE', icon: Flags.IE, menuKey: 'lng.irish' },
  { lng: 'de-DE', icon: Flags.DE, menuKey: 'lng.german' },
  { lng: 'it-IT', icon: Flags.IT, menuKey: 'lng.italian' },
  { lng: 'fr-FR', icon: Flags.FR, menuKey: 'lng.french' },
  { lng: 'ja-JP', icon: Flags.JP, menuKey: 'lng.japanese' },
  { lng: 'ru-RU', icon: Flags.RU, menuKey: 'lng.russian' },
  { lng: 'tr-TR', icon: Flags.TR, menuKey: 'lng.turkish' },
  { lng: 'uk-UA', icon: Flags.UA, menuKey: 'lng.ukraine' },
  { lng: 'km-KH', icon: Flags.KH, menuKey: 'lng.khmer' },
  { lng: 'zh-CN', icon: Flags.CN, menuKey: 'lng.chinese' },
  { lng: 'zh-TW', icon: Flags.TW, menuKey: 'lng.chineseTraditional' },
];

const languages = listLanguages.reduce((acc, item: LanguageConfiguration) => {
  acc.push(item.lng);
  return acc;
}, [] as string[]);

export const listLanguagesAsString = languages;

export type Language = keyof typeof listLanguagesAsString;
