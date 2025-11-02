import React, { ReactElement } from 'react';
import { createContext, useContext } from 'react';

import { useDataMutation } from '../../api/use-data-mutation';
import { getConfiguration } from '../../configuration';
import { APIRoute } from '../../store/routes';
import { stripTrailingSlash } from '../../store/utils';
import { LoginBody } from './types';
import { getDefaultUserState } from './utils';

// import { PackageMetaInterface } from '../../types/packageMeta';

interface ManifestsContextProps {
  // TODDO: define types
  handleLogin: (body: any) => Promise<any>;
  userState: LoginBody;
}

const defaultUserState: LoginBody = getDefaultUserState();

export const AuthV1Context = createContext<Partial<ManifestsContextProps>>({
  userState: defaultUserState,
  handleLogin: async (_loginData: LoginBody) => {},
});

const configuration = getConfiguration();

const AuthV1Provider: React.FC<{ children: ReactElement }> = ({ children }) => {
  const basePath = stripTrailingSlash(configuration.base);
  // const [formError, setFormError] = React.useState<any>(null);
  const [userState, setUserState] = React.useState<LoginBody>(defaultUserState);
  const { data, error, isMutating, trigger } = useDataMutation(basePath, APIRoute.LOGIN, 'POST');

  const handleLogin = async (body: any) => {
    // You can pass packageName and packageVersion as needed
    await trigger(body);
    console.log('AuthV1 data -->', data);
    return { data, error, isMutating };
  };

  return (
    <AuthV1Context.Provider
      value={{
        handleLogin,
        userState,
      }}
    >
      {children}
    </AuthV1Context.Provider>
  );
};

export { AuthV1Provider };

export const useAuthV1 = () => useContext(AuthV1Context);
