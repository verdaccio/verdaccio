export enum USER_API_ENDPOINTS {
  whoami = '/-/whoami',
  get_user = '/-/user/:org_couchdb_user',
  add_user = '/-/user/:org_couchdb_user/:_rev?/:revision?',
  user_token = '/-/user/token/*',
}

export enum STARS_API_ENDPOINTS {
  get_user_starred_packages = '/-/_view/starredByUser',
}

export enum SEARCH_API_ENDPOINTS {
  search = '/-/v1/search',
  deprecated_search = '/-/all(/since)?',
}

export enum PUBLISH_API_ENDPOINTS {
  add_package = '/:package',
  publish_package = '/:package/-rev/:revision',
  remove_tarball = '/:package/-/:filename/-rev/:revision',
}

export enum PING_API_ENDPOINTS {
  ping = '/-/ping',
}

export enum PACKAGE_API_ENDPOINTS {
  get_package_by_version = '/:package/:version?',
  get_package_tarball = '/:package/-/:filename',
}

export enum DIST_TAGS_API_ENDPOINTS {
  tagging = '/:package/:tag',
  tagging_package = '/-/package/:package/dist-tags/:tag',
  get_dist_tags = '/-/package/:package/dist-tags',
}

export enum PROFILE_API_ENDPOINTS {
  get_profile = '/-/npm/v1/user',
}

export enum TOKEN_API_ENDPOINTS {
  get_tokens = '/-/npm/v1/tokens',
  delete_token = '/-/npm/v1/tokens/token/:tokenKey',
}

export enum LOGIN_API_ENDPOINTS {
  login = '/-/v1/login',
  login_cli = '/-/v1/login/cli',
  login_cli_session = '/-/v1/login/cli/:sessionId',
  login_done = '/-/v1/done',
  login_done_session = '/-/v1/done/:sessionId',
}
