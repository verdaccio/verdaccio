export enum Route {
  ROOT = '/',
  DETAIL = '/-/web/detail/',
  SCOPE_PACKAGE = '/-/web/detail/:scope/:package',
  SCOPE_PACKAGE_VERSION = '/-/web/detail/:scope/:package/v/:version',
  PACKAGE = '/-/web/detail/:package',
  PACKAGE_VERSION = '/-/web/detail/:package/v/:version',
  // Security UI routes
  LOGIN = '/-/web/login',
  SUCCESS = '/-/web/success',
  ADD_USER = '/-/web/add-user',
  CHANGE_PASSWORD = '/-/web/change-password',
  // Security API routes
  LOGIN_API = '/-/v1/login_cli',
  CHANGE_PASSWORD_API = '/-/npm/v1/user',
}

// Example API request:
// http://localhost:8000/-/verdaccio/data/package/readme/jquery
export enum APIRoute {
  LOGIN = '/-/verdaccio/sec/login',
  RESET_PASSWORD = '/-/verdaccio/sec/reset_password',
  CONFIG = '/-/verdaccio/packages',
  PACKAGES = '/-/verdaccio/data/packages',
  SEARCH = '/-/verdaccio/data/search/', // :value
  SIDEBAR = '/-/verdaccio/data/sidebar/', // :packageName?v=version
  README = '/-/verdaccio/data/package/readme/', // :packageName?v=version
}
