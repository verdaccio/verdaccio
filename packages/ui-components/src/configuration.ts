import type { TemplateUIOptions } from '@verdaccio/types';

const defaultValues: TemplateUIOptions = {
  primaryColor: '#ffffff',
  darkMode: false,
  pkgManagers: ['yarn', 'pnpm', 'npm'],
  scope: '',
  base: '',
  login: true,
  flags: {},
  url_prefix: '',
  title: 'Verdaccio',
};

export function getConfiguration() {
  const uiConfiguration = window?.__VERDACCIO_BASENAME_UI_OPTIONS ?? defaultValues;
  return uiConfiguration;
}
