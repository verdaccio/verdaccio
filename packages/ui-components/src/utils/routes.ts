export enum Route {
  ROOT = '/',
  DETAIL = '/-/web/detail/',
  SCOPE_PACKAGE = '/-/web/detail/@:scope/:package',
  SCOPE_PACKAGE_VERSION = '/-/web/detail/@:scope/:package/v/:version',
  PACKAGE = '/-/web/detail/:package',
  PACKAGE_VERSION = '/-/web/detail/:package/v/:version',
}
