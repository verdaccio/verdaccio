import { createModel } from '@rematch/core';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { Manifest, TemplateUIOptions } from '@verdaccio/types';

import type { RootModel } from '.';
import { colors } from '../../Theme';
import API from '../api';
import { APIRoute } from './routes';

const defaultValues: TemplateUIOptions = {
  primaryColor: colors.PRIMARY_COLOR,
  darkMode: false,
  pkgManagers: ['yarn', 'pnpm', 'npm'],
  scope: '',
  base: '',
  login: true,
  flags: {},
  url_prefix: '',
  title: 'Verdaccio',
};

function getConfiguration() {
  const uiConfiguration = window?.__VERDACCIO_BASENAME_UI_OPTIONS ?? defaultValues;
  if (isNil(uiConfiguration.primaryColor) || isEmpty(uiConfiguration.primaryColor)) {
    uiConfiguration.primaryColor = colors.PRIMARY_COLOR;
  }

  return uiConfiguration;
}

/**
 *
 * @category Model
 */
export const configuration = createModel<RootModel>()({
  state: {
    config: getConfiguration(),
  },
  effects: (dispatch) => ({
    async getPackages() {
      const payload: Manifest[] = await API.request(APIRoute.CONFIG, 'GET');
      dispatch.packages.savePackages(payload);
    },
  }),
});
