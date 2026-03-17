import type { ReactElement } from 'react';
import React, { createContext, useContext, useEffect } from 'react';

import { useDataMutation } from '../../api/use-data-mutation';
import { getConfiguration } from '../../configuration';
import { APIRoute } from '../../store/routes';
import { clearAuth, saveAuth } from '../../store/storage';
import { stripTrailingSlash } from '../../store/utils';
import type { LoginBody } from './types';
import { getDefaultUserState } from './utils';

interface AuthContextProps {
  handleLogin: (body: { username: string; password: string }) => Promise<any>;
  setUserState: React.Dispatch<React.SetStateAction<LoginBody>>;
  logOutUser: () => void;
  userState: LoginBody;
}

export const AuthContext = createContext<Partial<AuthContextProps>>({
  userState: { token: null, username: null },
  setUserState: () => {},
  handleLogin: async () => {},
  logOutUser: () => {},
});

const configuration = getConfiguration();
const basePath = stripTrailingSlash(configuration.base);

const AuthProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
  const [userState, setUserState] = React.useState<LoginBody>(getDefaultUserState());
  const { data, isMutating, trigger } = useDataMutation<LoginBody>(
    basePath,
    APIRoute.LOGIN,
    'POST'
  );

  const handleLogin = async (body: { username: string; password: string }) => {
    await trigger(body);
  };

  const logOutUser = () => {
    setUserState(getDefaultUserState());
    clearAuth();
    window.location?.reload();
  };

  useEffect(() => {
    if (data && !isMutating) {
      setUserState(data as LoginBody);
      if (data.username && data.token) {
        saveAuth(data.username, data.token);
      }
    }
  }, [data, isMutating]);

  return (
    <AuthContext.Provider
      value={{
        handleLogin,
        userState,
        logOutUser,
        setUserState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

export const useAuth = () => useContext(AuthContext);
