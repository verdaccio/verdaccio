import dayjs from 'dayjs';
import i18n from 'i18next';

function getFallFackLanguage(): string | undefined {
  const fallbackLanguage = i18n.options.fallbackLng;

  if (Array.isArray(fallbackLanguage)) {
    return fallbackLanguage[0];
  }

  if (typeof fallbackLanguage === 'string') {
    return fallbackLanguage;
  }

  return undefined;
}

async function loadDayJSLocale() {
  const fallbackLanguage = getFallFackLanguage();
  const locale = i18n.language || fallbackLanguage;

  switch (locale?.toLowerCase()) {
    case 'pt-br':
      await import('dayjs/locale/pt-br');
      dayjs.locale('pt-br');
      break;
    case 'de-de':
      await import('dayjs/locale/de');
      dayjs.locale('de');
      break;
    case 'es-es':
      await import('dayjs/locale/es');
      dayjs.locale('es');
      break;
    case 'fr-fr':
      await import('dayjs/locale/fr');
      dayjs.locale('fr');
      break;
    case 'zh-cn':
      await import('dayjs/locale/zh-cn');
      dayjs.locale('zh-cn');
      break;
    case 'ja-jp':
      await import('dayjs/locale/ja');
      dayjs.locale('ja');
      break;
    case 'ru-ru':
      await import('dayjs/locale/ru');
      dayjs.locale('ru');
      break;
    case 'tr-tr':
      await import('dayjs/locale/tr');
      dayjs.locale('tr');
      break;
    case 'uk-ua':
      await import('dayjs/locale/uk');
      dayjs.locale('uk');
      break;
    case 'zh-tw':
      await import('dayjs/locale/zh-tw');
      dayjs.locale('zh-tw');
      break;
    case 'cs-cz':
      await import('dayjs/locale/cs');
      dayjs.locale('cs');
      break;
    default:
      await import('dayjs/locale/en');
      dayjs.locale('en');
      break;
  }
}

export default loadDayJSLocale;
