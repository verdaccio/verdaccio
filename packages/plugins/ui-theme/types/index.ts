// FIXME: this should comes from @verdaccio/types

type PackageManagers = 'pnpm' | 'yarn' | 'npm';
export interface VerdaccioOptions {
  url_prefix: string;
  base: string;
  scope: string;
  title: string;
  primaryColor: string;
  darkMode: boolean;
  uri?: string;
  login?: boolean;
  language?: string;
  version?: string;
  protocol?: string;
  host?: string;
  logo?: string;
  pkgManagers?: PackageManagers[];
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
