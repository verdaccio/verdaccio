/**
 * Enum for web urls, used on the web middleware
 */
export enum WebUrls {
  sidebar_scopped_package = '/sidebar/:scope/:package',
  sidebar_package = '/sidebar/:package',
  readme_package_scoped_version = '/package/readme/:scope/:package/{:version}',
  readme_package_version = '/package/readme/:package/{:version}',
  packages_all = '/packages',
  user_login = '/login',
  user_signup = '/signup',
  search = '/search/:anything',
  reset_password = '/reset_password',
}

/**
 * Enum for web urls namespace, used on the web middleware
 */
export enum WebUrlsNamespace {
  root = '/',
  static = '/-/static/{*all}',
  endpoints = '/-/verdaccio/',
  web = '/-/web/{*all}',
  data = '/data/',
  sec = '/sec/',
}
