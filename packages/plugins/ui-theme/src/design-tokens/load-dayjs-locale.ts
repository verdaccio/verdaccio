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

function loadDayJSLocale() {
  const fallbackLanguage = getFallFackLanguage();
  const locale = i18n.language || fallbackLanguage;

  switch (locale?.toLowerCase()) {
    case 'pt-br':
      {
        require('dayjs/locale/pt-br');
        dayjs.locale('pt-br');
      }
      break;
    case 'de-de':
      {
        require('dayjs/locale/de');
        dayjs.locale('de');
      }
      break;
    case 'es-es':
      {
        require('dayjs/locale/es');
        dayjs.locale('es');
      }
      break;
    case 'fr-fr':
      {
        require('dayjs/locale/fr');
        dayjs.locale('fr');
      }
      break;
    case 'zh-cn':
      {
        require('dayjs/locale/zh-cn');
        dayjs.locale('zh-cn');
      }
      break;
    case 'ja-jp':
      {
        require('dayjs/locale/ja');
        dayjs.locale('ja');
      }
      break;
    case 'ru-ru':
      {
        require('dayjs/locale/ru');
        dayjs.locale('ru');
      }
      break;
    case 'tr-tr':
      {
        require('dayjs/locale/tr');
        dayjs.locale('tr');
      }
      break;
    case 'uk-ua':
      {
        require('dayjs/locale/uk');
        dayjs.locale('uk');
      }
      break;
    case 'zh-tw':
      {
        require('dayjs/locale/zh-tw');
        dayjs.locale('zh-tw');
      }
      break;
    case 'cs-cz':
      {
        require('dayjs/locale/cs');
        dayjs.locale('cs');
      }
      break;
    default:
      {
        require('dayjs/locale/en');
        dayjs.locale('en');
      }
      break;
  }
}

export default loadDayJSLocale;
