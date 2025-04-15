export enum Route {
  ROOT = '/',
  DETAIL = '/-/web/detail/',
  SCOPE_PACKAGE = '/-/web/detail/@:scope/:package',
  SCOPE_PACKAGE_VERSION = '/-/web/detail/@:scope/:package/v/:version',
  PACKAGE = '/-/web/detail/:package',
  PACKAGE_VERSION = '/-/web/detail/:package/v/:version',
  // Security UI routes
  LOGIN = '/-/web/login',
  SUCCESS = '/-/web/success',
  ADD_USER = '/-/web/add-user',
  CHANGE_PASSWORD = '/-/web/change-password',
  // Security API routes
  LOGIN_API = '/-/v1/login_cli',
  ADD_USER_API = '/-/user/org.couchdb.user',
  CHANGE_PASSWORD_API = '/-/npm/v1/user',
}
