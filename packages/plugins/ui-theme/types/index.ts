// FIXME: this should comes from @verdaccio/types
export interface VerdaccioOptions {
  url_prefix: string;
  base: string;
  language?: string;
  darkMode?: boolean;
}

declare global {
  interface Window {
    __VERDACCIO_BASENAME_UI_OPTIONS: VerdaccioOptions;
    VERDACCIO_PRIMARY_COLOR: string;
    VERDACCIO_LOGO: string;
    VERDACCIO_SCOPE: string;
    VERDACCIO_VERSION: string;
    VERDACCIO_API_URL: string;
  }
}
