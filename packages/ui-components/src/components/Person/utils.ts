import i18next from 'i18next';

import { Developer } from '../../types/packageMeta';
import { url } from '../../utils';

export function getLink(person: Developer, packageName: string, version: string): string {
  return person.email && url.isEmail(person.email)
    ? `mailto:${person.email}?subject=${packageName} v${version}`
    : person.url && url.isURL(person.url)
      ? person.url
      : '';
}

export function getName(name?: string): string {
  return !name
    ? i18next.t('author-unknown')
    : name.toLowerCase() === 'anonymous'
      ? i18next.t('author-anonymous')
      : name;
}
