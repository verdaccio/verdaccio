import { createModel } from '@rematch/core';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import { PRIMARY_COLOR } from 'verdaccio-ui/utils/colors';

import { Package, TemplateUIOptions } from '@verdaccio/types';

import type { RootModel } from '.';
import API from '../../providers/API/api';

const defaultValues: TemplateUIOptions = {
  primaryColor: PRIMARY_COLOR,
  darkMode: false,
  pkgManagers: ['yarn', 'pnpm', 'npm'],
  scope: '',
  base: '',
  login: true,
  url_prefix: '',
  title: 'Verdaccio',
};

function getConfiguration() {
  const uiConfiguration = window?.__VERDACCIO_BASENAME_UI_OPTIONS ?? defaultValues;
  if (isNil(uiConfiguration.primaryColor) || isEmpty(uiConfiguration.primaryColor)) {
    uiConfiguration.primaryColor = PRIMARY_COLOR;
  }

  return uiConfiguration;
}

export const configuration = createModel<RootModel>()({
  state: {
    config: getConfiguration(),
  },
  effects: (dispatch) => ({
    async getPackages() {
      const payload: Package[] = await API.request(`/-/verdaccio/packages`, 'GET');
      dispatch.packages.savePackages(payload);
    },
  }),
});
