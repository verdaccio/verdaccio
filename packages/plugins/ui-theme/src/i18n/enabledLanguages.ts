export const DEFAULT_LANGUAGE = 'en-US';

export const enabledLanguages = [
  DEFAULT_LANGUAGE,
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
];

export type Language = keyof typeof enabledLanguages;
