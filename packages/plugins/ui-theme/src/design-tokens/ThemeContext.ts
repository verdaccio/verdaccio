import { createContext } from 'react';

import { Language } from '../../i18n/config';
interface Props {
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
  language: Language;
  setLanguage: (language: Language) => void;
}

const ThemeContext = createContext<undefined | Props>(undefined);

export default ThemeContext;
