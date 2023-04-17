import { i18n } from 'i18next';
import React, { FunctionComponent, createContext, useCallback, useContext, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';

import useLocalStorage from '../../hooks/useLocalStorage';

export type TranslatorProviderProps = {
  setLanguage: (lng: string) => void;
  language: string;
  listLanguages: LanguageItem[];
};

export type LanguageItem = { lng: string; icon: any; menuKey: string };

const I18nTranslatorContext = createContext<TranslatorProviderProps>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setLanguage: (_lng: string) => {},
  language: 'en-US',
  listLanguages: [],
});

/**
 * Translator provider
 * @category Provider
 */
const TranslatorProvider: FunctionComponent<{
  children: React.ReactElement<any>;
  i18n: i18n;
  listLanguages: any;
  onMount: () => {};
}> = ({ children, onMount, i18n, listLanguages }) => {
  const currentLanguage = i18n.languages?.[0];
  const [language, setLanguage] = useLocalStorage<string>('language', currentLanguage);
  const changeLanguage = useCallback(async () => {
    await i18n.changeLanguage(language);
  }, [i18n, language]);

  useEffect(() => {
    changeLanguage();
    onMount();
  }, [language, onMount, changeLanguage]);

  return (
    <I18nextProvider i18n={i18n}>
      <I18nTranslatorContext.Provider value={{ setLanguage, language, listLanguages }}>
        {children}
      </I18nTranslatorContext.Provider>
    </I18nextProvider>
  );
};

export default TranslatorProvider;

export const useLanguage = () => useContext(I18nTranslatorContext);
