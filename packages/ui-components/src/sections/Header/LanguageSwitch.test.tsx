import { fireEvent, render, screen } from '@testing-library/react';
import i18n from 'i18next';
import React from 'react';
import { initReactI18next } from 'react-i18next';

import { ThemeProvider } from '../../Theme';
import { AppConfigurationProvider } from '../../providers';
import { TranslatorProvider } from '../../providers/TranslatorProvider';
import LanguageSwitch from './LanguageSwitch';

// LanguageSwitch lists the languages registered on the global i18next instance
i18n.use(initReactI18next).init({
  lng: 'en-US',
  fallbackLng: 'en-US',
  load: 'currentOnly',
  resources: {
    'en-US': { translation: { 'lng.english': 'English', 'lng.spanish': 'Spanish' } },
    'es-ES': { translation: {} },
  },
  debug: false,
  showSupportNotice: false,
  interpolation: { escapeValue: false },
});

const EnglishIcon = () => <span data-testid="icon-en" />;
const SpanishIcon = () => <span data-testid="icon-es" />;

const listLanguages = [
  { lng: 'en-US', menuKey: 'lng.english', icon: EnglishIcon },
  { lng: 'es-ES', menuKey: 'lng.spanish', icon: SpanishIcon },
];

const renderSwitch = () =>
  render(
    <AppConfigurationProvider>
      <ThemeProvider>
        <TranslatorProvider i18n={i18n} listLanguages={listLanguages} onMount={() => {}}>
          <LanguageSwitch />
        </TranslatorProvider>
      </ThemeProvider>
    </AppConfigurationProvider>
  );

describe('<LanguageSwitch />', () => {
  afterEach(() => {
    window.localStorage.removeItem('language');
  });

  test('should render one card per registered language', () => {
    renderSwitch();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Spanish')).toBeInTheDocument();
    expect(screen.getByTestId('icon-en')).toBeInTheDocument();
    expect(screen.getByTestId('icon-es')).toBeInTheDocument();
  });

  test('should switch and persist the language when clicking another card', async () => {
    renderSwitch();

    fireEvent.click(screen.getByText('Spanish'));

    expect(JSON.parse(window.localStorage.getItem('language') as string)).toBe('es-ES');
  });
});
