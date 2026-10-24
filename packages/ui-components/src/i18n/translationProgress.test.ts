import { describe, expect, test } from 'vitest';

import { getTranslationProgress } from './translationProgress';

const source = {
  title: 'Translations',
  lng: { english: 'English', spanish: 'Spanish' },
  form: { login: { user: 'User', password: 'Password' } },
};

describe('getTranslationProgress', () => {
  test('counts nested strings', () => {
    expect(getTranslationProgress(source, source)).toBe(100);
    expect(getTranslationProgress(source, { lng: { english: 'Inglés' } })).toBe(20);
  });

  test('treats a missing or empty translation as untranslated', () => {
    expect(getTranslationProgress(source, undefined)).toBe(0);
    expect(getTranslationProgress(source, {})).toBe(0);
    expect(getTranslationProgress(source, { title: '', lng: 'not an object' })).toBe(0);
  });

  test('ignores keys that are not in the source and rounds down', () => {
    expect(
      getTranslationProgress(source, { title: 'Traducciones', obsolete: 'x', extra: { a: 'b' } })
    ).toBe(20);
    expect(getTranslationProgress({ a: 'a', b: 'b', c: 'c' }, { a: 'x', b: 'y' })).toBe(66);
  });
});
