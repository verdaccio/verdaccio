import type { ReactElement } from 'react';
import React, { createContext, use } from 'react';
import { useSWRConfig } from 'swr';

import { useDataMutation } from '../../api/use-data-mutation';
import { getConfiguration } from '../../configuration';
import { APIRoute } from '../../store/routes';
import { clearAuth, saveAuth } from '../../store/storage';
import { stripTrailingSlash } from '../../store/utils';
import type { LoginBody } from './types';
import { clearExpiredAuth, getDefaultUserState } from './utils';

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
  // lazy initializer: reading storage and decoding the JWT on every render is wasted work
  const [userState, setUserState] = React.useState<LoginBody>(getDefaultUserState);

  React.useEffect(() => {
    clearExpiredAuth();
  }, []);
  const { trigger } = useDataMutation<LoginBody>(basePath, APIRoute.LOGIN, 'POST');
  const { mutate } = useSWRConfig();

  const handleLogin = async (body: { username: string; password: string }) => {
    const result = await trigger(body);
    if (!result || !result.username || !result.token) {
      // a 2xx with an unexpected body (proxy or auth plugin returning html)
      // must not pass as a successful login
      throw new Error('login response is missing the token');
    }
    saveAuth(result.username, result.token);
    setUserState(result as LoginBody);
    // Revalidate the packages list so it reflects authenticated access
    mutate(`${basePath}${APIRoute.PACKAGES}`);
  };

  const logOutUser = () => {
    // clear storage first: getDefaultUserState reads it, and the token is
    // still valid at this point, so the old order re-hydrated the session
    clearAuth();
    setUserState(getDefaultUserState());
    window.location?.reload();
  };

  return (
    <AuthContext
      value={{
        handleLogin,
        userState,
        logOutUser,
        setUserState,
      }}
    >
      {children}
    </AuthContext>
  );
};

export { AuthProvider };

export const useAuth = () => use(AuthContext);
