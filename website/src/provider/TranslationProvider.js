import React, { useContext, useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { lisan } from 'lisan';

const Context = React.createContext();

export const TranslationProvider = ({ children }) => {
  const [loaded, setLoaded] = useState(false);
  const translationData = useMemo(() => ({ loaded }), [loaded]);

  const [language, setLanguage] = useState('en');

  const updateLanguage = (lang) => {
    lisan.setLocaleName(lang);

    import(`../dictionaries/${lang}/main`).then((dict) => {
      lisan.add(dict);
      setLoaded(true);
      setLanguage(lang);
    });
  };

  useEffect(() => {
    updateLanguage(language);
  }, [language]);

  return <Context.Provider value={translationData}>{children}</Context.Provider>;
};

export const useTranslationProvider = () => useContext(Context);

TranslationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
