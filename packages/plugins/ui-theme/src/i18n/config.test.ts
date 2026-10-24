import { afterEach, describe, expect, test } from 'vitest';

import i18n from './config';
import { DEFAULT_LANGUAGE } from './enabledLanguages';

describe('i18n config', () => {
  afterEach(async () => {
    i18n.removeResourceBundle('es-ES', 'translation');
    await i18n.changeLanguage(DEFAULT_LANGUAGE);
  });

  test('falls back to English for strings exported as empty', async () => {
    i18n.addResourceBundle('es-ES', 'translation', { loading: '', 'author-anonymous': 'Anónimo' });
    await i18n.changeLanguage('es-ES');

    expect(i18n.t('loading')).toBe('Loading...');
    expect(i18n.t('author-anonymous')).toBe('Anónimo');
  });

  test('falls back to English for strings missing from a translation', async () => {
    i18n.addResourceBundle('es-ES', 'translation', { 'author-anonymous': 'Anónimo' });
    await i18n.changeLanguage('es-ES');

    expect(i18n.t('loading')).toBe('Loading...');
  });
});
