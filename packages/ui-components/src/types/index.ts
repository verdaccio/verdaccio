import { TemplateUIOptions } from '@verdaccio/types';

declare global {
  interface Window {
    /**
     * __VERDACCIO_BASENAME_UI_OPTIONS is a global object available in the
     * browser.
     */
    __VERDACCIO_BASENAME_UI_OPTIONS: TemplateUIOptions;
  }
}
