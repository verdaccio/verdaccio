import React, { ReactElement } from 'react';
import { createContext, useContext } from 'react';

import { useDataMutation } from '../../api/use-data-mutation';
import { getConfiguration } from '../../configuration';
import { APIRoute } from '../../store/routes';
import { stripTrailingSlash } from '../../store/utils';
import { LoginBody } from './types';
import { getDefaultUserState } from './utils';

interface ManifestsContextProps {
  // TODDO: define types
  handleLogin: (body: any) => Promise<any>;
  userState: LoginBody;
}

const defaultUserState: LoginBody = getDefaultUserState();

export const AuthContext = createContext<Partial<ManifestsContextProps>>({
  userState: defaultUserState,
  handleLogin: async (_loginData: LoginBody) => {},
});

const configuration = getConfiguration();

const AuthProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
  const basePath = stripTrailingSlash(configuration.base);
  const [userState, setUserState] = React.useState<LoginBody>(defaultUserState);
  const { data, error, isMutating, trigger } = useDataMutation(basePath, APIRoute.LOGIN, 'POST');

  const handleLogin = async (body: any) => {
    // You can pass packageName and packageVersion as needed
    await trigger(body);
    console.log('auth data -->', data);
    return { data, error, isMutating };
  };

  return (
    <AuthContext.Provider
      value={{
        handleLogin,
        userState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

export const useAuth = () => useContext(AuthContext);
