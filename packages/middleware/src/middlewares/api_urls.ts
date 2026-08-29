export enum USER_API_ENDPOINTS {
  whoami = '/-/whoami',
  get_user = '/-/user/:org_couchdb_user',
  add_user = '/-/user/:org_couchdb_user{/:_rev}{/:revision}',
  user_token = '/-/user/token/{*subject}',
}

export enum SEARCH_API_ENDPOINTS {
  search = '/-/v1/search',
  deprecated_search = '/-/all{/:since}',
}

export enum PUBLISH_API_ENDPOINTS {
  add_package = '/:package',
  publish_package = '/:package/-rev/:revision',
  remove_tarball = '/:package/-/:filename/-rev/:revision',
}

/**
 * Staged publish workflow (`npm stage`).
 *
 * `stage_package` must keep the literal `package` segment before `:stageId`
 * routes so it is not swallowed by them, and every `:stageId` is constrained to
 * a UUID (the npm CLI validates the format client side before calling).
 */
export enum STAGE_API_ENDPOINTS {
  list = '/-/stage',
  stage_package = '/-/stage/package/:package',
  item = '/-/stage/:stageId',
  approve = '/-/stage/:stageId/approve',
  tarball = '/-/stage/:stageId/tarball',
}

export enum PING_API_ENDPOINTS {
  ping = '/-/ping',
}

export enum PACKAGE_API_ENDPOINTS {
  get_package_by_version = '/:package{/:version}',
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
  login_cli = '/-/v1/login_cli',
  login_cli_session = '/-/v1/login_cli/:sessionId',
  login_done = '/-/v1/done',
  login_done_session = '/-/v1/done/:sessionId',
}
