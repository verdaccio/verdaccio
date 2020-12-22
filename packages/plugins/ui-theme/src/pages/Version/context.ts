import { createContext, Consumer, Provider } from 'react';

import { DetailContextProps, VersionPageConsumerProps } from './version-config';

export const DetailContext = createContext<Partial<DetailContextProps>>({});

export const DetailContextProvider: Provider<Partial<VersionPageConsumerProps>> =
  DetailContext.Provider;
export const DetailContextConsumer: Consumer<Partial<VersionPageConsumerProps>> =
  DetailContext.Consumer;
