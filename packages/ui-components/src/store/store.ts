import type { RematchDispatch, RematchRootState } from '@rematch/core';
import { init } from '@rematch/core';
import type { ExtraModelsFromLoading } from '@rematch/loading';
import loadingPlugin from '@rematch/loading';

import type { RootModel } from './models';
import { models } from './models';

type FullModel = ExtraModelsFromLoading<RootModel>;

export const store = init<RootModel, FullModel>({
  models,
  plugins: [loadingPlugin()],
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel, FullModel>;
