/* eslint-disable react-hooks/exhaustive-deps */
import { Package } from '@verdaccio/types';
import React, { createContext, FunctionComponent, useContext, useMemo } from 'react';

import { useConfig } from 'verdaccio-ui/providers/config';

import { HEADERS } from '../../../lib/constants';
import { PackageMetaInterface } from '../../../types/packageMeta';

import API from './api';

type ConfigProviderProps = {
  callReadme: (packageName: string, packageVersion?: string) => Promise<string>;
  callDetailPage: (packageName: string, packageVersion?: string) => Promise<PackageMetaInterface>;
  callSearch: (value: string, signal: AbortSignal) => Promise<string>;
  getPackages: () => Promise<Package[]>;
  doLogin: (username: string, password: string) => Promise<LoginBody>;
  getResource: (link: string) => Promise<Blob>;
};

export interface LoginError {
  type: string;
  description: string;
}

export interface LoginBody {
  username?: string;
  token?: string;
  error?: LoginError;
}

// @ts-ignore
const AppAPIContext = createContext<ConfigProviderProps>({});

const APIProvider: FunctionComponent = ({ children }) => {
  const { configOptions } = useConfig();

  const buildURL = (basePath: string) => {
    return `${configOptions?.base}-/verdaccio/${basePath}`;
  };

  const callReadme = async (packageName: string, packageVersion?: string): Promise<string> => {
    return await API.request<string>(
      buildURL(`package/readme/${packageName}${packageVersion ? `?v=${packageVersion}` : ''}`),
      'GET'
    );
  };

  const callDetailPage = async (
    packageName: string,
    packageVersion?: string
  ): Promise<PackageMetaInterface> => {
    return await API.request<PackageMetaInterface>(
      buildURL(`sidebar/${packageName}${packageVersion ? `?v=${packageVersion}` : ''}`),
      'GET'
    );
  };

  const callSearch = async (value: string, signal: AbortSignal): Promise<string> => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API#Browser_compatibility
    // FUTURE: signal is not well supported for IE and Samsung Browser
    return API.request(buildURL(`search/${encodeURIComponent(value)}`), 'GET', {
      signal,
      headers: {},
    });
  };

  const getPackages = async (): Promise<Package[]> => {
    return await API.request(buildURL('packages'), 'GET');
  };

  const doLogin = async (username: string, password: string): Promise<LoginBody> => {
    return await API.request(buildURL('login'), 'POST', {
      body: JSON.stringify({ username, password }),
      headers: {
        Accept: HEADERS.JSON,
        'Content-Type': HEADERS.JSON,
      },
    });
  };

  const getResource = async (link: string): Promise<Blob> => {
    return await API.request(link, 'GET', {
      headers: {
        ['accept']:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
      },
      credentials: 'include',
    });
  };

  const value = useMemo(
    () => ({
      callReadme,
      callDetailPage,
      callSearch,
      getPackages,
      doLogin,
      getResource,
    }),
    [callReadme, getResource, callDetailPage, callSearch, doLogin]
  );

  return <AppAPIContext.Provider value={value}>{children}</AppAPIContext.Provider>;
};

export default APIProvider;

export const useAPI = () => useContext(AppAPIContext);
