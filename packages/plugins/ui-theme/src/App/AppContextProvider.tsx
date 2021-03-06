import React, { useState, useEffect } from 'react';

import AppContext, { AppProps, User } from './AppContext';

interface Props {
  user?: User;
}

/* eslint-disable react-hooks/exhaustive-deps */
const AppContextProvider: React.FC<Props> = ({ children, user }) => {
  const [state, setState] = useState<AppProps>({
    scope: window?.__VERDACCIO_BASENAME_UI_OPTIONS?.scope ?? '',
    user,
  });

  useEffect(() => {
    setState({
      ...state,
      user,
    });
  }, [user]);

  const setUser = (user?: User) => {
    setState({
      ...state,
      user,
    });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setUser,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
