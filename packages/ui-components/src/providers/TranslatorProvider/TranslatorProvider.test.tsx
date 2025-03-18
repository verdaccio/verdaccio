import { render } from '@testing-library/react';
import i18n from 'i18next';
import React from 'react';
import { initReactI18next } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import { vi } from 'vitest';

import TranslatorProvider, { useLanguage } from './TranslatorProvider';

i18n.use(initReactI18next).init({
  lng: 'en-US',
  fallbackLng: 'en-US',
  whitelist: ['en-US'],
  load: 'currentOnly',
  react: {
    useSuspense: false,
  },
  resources: {
    'en-US': {
      translation: {
        'copy-to-clipboard': 'Copy to clipboard',
        'author-anonymous': 'Anonymous',
        'author-unknown': 'Unknown',
      },
    },
  },
  debug: false,
  interpolation: {
    escapeValue: false,
  },
});

const RandomComponent = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  return (
    <div>
      <div>{language}</div>
      <div>{t('copy-to-clipboard')}</div>
    </div>
  );
};

test('should provide translation', () => {
  const mount = vi.fn();
  const { getByText } = render(
    <TranslatorProvider i18n={i18n} listLanguages={[]} onMount={mount}>
      <RandomComponent />
    </TranslatorProvider>
  );
  expect(getByText('en-US')).toBeInTheDocument();
  expect(getByText('Copy to clipboard')).toBeInTheDocument();
});
