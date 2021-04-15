import React, { useState, useEffect } from 'react';

import { useConfig } from 'verdaccio-ui/providers/config';

import AppContext, { AppProps, User } from './AppContext';

interface Props {
  user?: User;
}

/* eslint-disable react-hooks/exhaustive-deps */
const AppContextProvider: React.FC<Props> = ({ children, user }) => {
  const { configOptions } = useConfig();
  const [state, setState] = useState<AppProps>({
    scope: configOptions.scope ?? '',
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
