import { TemplateUIOptions } from '@verdaccio/types';

declare global {
  interface Window {
    __VERDACCIO_BASENAME_UI_OPTIONS: TemplateUIOptions;
    // FIXME: remove all these variables
    VERDACCIO_PRIMARY_COLOR: string;
    VERDACCIO_LOGO: string;
    VERDACCIO_SCOPE: string;
    VERDACCIO_VERSION: string;
    VERDACCIO_API_URL: string;
  }
}
