import { RematchDispatch, RematchRootState, init } from '@rematch/core';
import loadingPlugin, { ExtraModelsFromLoading } from '@rematch/loading';
import persistPlugin from '@rematch/persist';
import storage from 'redux-persist/lib/storage';

import { RootModel, models } from './models';

type FullModel = ExtraModelsFromLoading<RootModel>;

const persistConfig = {
  key: 'root',
  storage,
};

export const store = init<RootModel, FullModel>({
  models,
  plugins: [loadingPlugin(), persistPlugin(persistConfig)],
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel, FullModel>;
