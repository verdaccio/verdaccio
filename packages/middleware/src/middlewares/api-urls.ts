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
 * Staged publish workflow (`npm stage`), matching the routes npmjs documents.
 *
 * | Method   | Route                          | Command              |
 * | -------- | ------------------------------ | -------------------- |
 * | `POST`   | `/-/stage/package/:package`    | `npm stage publish`  |
 * | `GET`    | `/-/stage`                     | `npm stage list`     |
 * | `GET`    | `/-/stage/:stageId`            | `npm stage view`     |
 * | `GET`    | `/-/stage/:stageId/tarball`    | `npm stage download` |
 * | `POST`   | `/-/stage/:stageId/approve`    | `npm stage approve`  |
 * | `DELETE` | `/-/stage/:stageId`            | `npm stage reject`   |
 *
 * `list` accepts `package`, `page` and `perPage` as query parameters. All the
 * routes require authentication.
 *
 * The body of `stage_package` is the same packument a regular publish sends —
 * `libnpmpublish` builds the payload once and only swaps method and route — so
 * staging reuses every validation the publish path already performs.
 *
 * Two constraints on the shapes above:
 *
 * - `stage_package` must keep the literal `package` segment declared before the
 *   `:stageId` routes, otherwise they swallow it.
 * - `:stageId` is constrained to a UUID, because the npm CLI validates the
 *   format client side before it ever calls the registry.
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
