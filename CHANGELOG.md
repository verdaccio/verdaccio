# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="3.3.0"></a>
# [3.3.0](https://github.com/verdaccio/verdaccio/compare/v3.2.0...v3.3.0) (2018-07-22)


### Bug Fixes

* add RemoteUser type for auth ([2f4dbe8](https://github.com/verdaccio/verdaccio/commit/2f4dbe8))
* adds webpack banner plugin to tag bundles with version ([#784](https://github.com/verdaccio/verdaccio/issues/784)) ([dac28d3](https://github.com/verdaccio/verdaccio/commit/dac28d3))
* dynamic date generation for <Package /> component test ([e5ea0c2](https://github.com/verdaccio/verdaccio/commit/e5ea0c2))
* ignores http_proxy and https_proxy ([d04dc8d](https://github.com/verdaccio/verdaccio/commit/d04dc8d))
* improves regex for ascii and test ([#461](https://github.com/verdaccio/verdaccio/issues/461)) ([be3968f](https://github.com/verdaccio/verdaccio/commit/be3968f))
* license field alignment on web ui ([#761](https://github.com/verdaccio/verdaccio/issues/761)) ([9fa523a](https://github.com/verdaccio/verdaccio/commit/9fa523a))
* open external tabs in new tabs ([25e8e60](https://github.com/verdaccio/verdaccio/commit/25e8e60))
* package.json to reduce vulnerabilities ([389e306](https://github.com/verdaccio/verdaccio/commit/389e306))
* solve seo issue [#760](https://github.com/verdaccio/verdaccio/issues/760) ([62d3033](https://github.com/verdaccio/verdaccio/commit/62d3033))
* wrong auth plugin signature ([5c2c414](https://github.com/verdaccio/verdaccio/commit/5c2c414))


### Features

* adds support for ascii-doc preview in readme ([#464](https://github.com/verdaccio/verdaccio/issues/464)) ([29bb57a](https://github.com/verdaccio/verdaccio/commit/29bb57a))
* adds support for external plugin directory ([#532](https://github.com/verdaccio/verdaccio/issues/532)) ([11dcf79](https://github.com/verdaccio/verdaccio/commit/11dcf79))
* capitalises logged in username ([#752](https://github.com/verdaccio/verdaccio/issues/752)) ([0e21e35](https://github.com/verdaccio/verdaccio/commit/0e21e35))



<a name="3.2.0"></a>
# [3.2.0](https://github.com/verdaccio/verdaccio/compare/v3.1.2...v3.2.0) (2018-06-15)


### Bug Fixes

* allowing to allow replace static enpoint in case of reverse proxy ([90803c7](https://github.com/verdaccio/verdaccio/commit/90803c7))
* fixed linebreaks lint issue ([9e3ab09](https://github.com/verdaccio/verdaccio/commit/9e3ab09))
* normalize package was broken [#758](https://github.com/verdaccio/verdaccio/issues/758) ([3717ad4](https://github.com/verdaccio/verdaccio/commit/3717ad4))


### Features

* Add basic package infos and resource links to sidebar. ([7bd3a4f](https://github.com/verdaccio/verdaccio/commit/7bd3a4f))
* add published package support to template ([4245636](https://github.com/verdaccio/verdaccio/commit/4245636))
* added information about package publisher for notifications ([1ca5298](https://github.com/verdaccio/verdaccio/commit/1ca5298))



<a name="3.1.2"></a>
## [3.1.2](https://github.com/verdaccio/verdaccio/compare/v3.1.1...v3.1.2) (2018-06-11)


### Bug Fixes

* configure fetch to send cookies ([98ac855](https://github.com/verdaccio/verdaccio/commit/98ac855))
* search implementation depends now of each plugin ([8f0508f](https://github.com/verdaccio/verdaccio/commit/8f0508f))



<a name="3.1.1"></a>
## [3.1.1](https://github.com/verdaccio/verdaccio/compare/v3.1.0...v3.1.1) (2018-06-07)


### Bug Fixes

* migration issue with old storage [#740](https://github.com/verdaccio/verdaccio/issues/740) ([e977d50](https://github.com/verdaccio/verdaccio/commit/e977d50))



<a name="3.1.0"></a>
# [3.1.0](https://github.com/verdaccio/verdaccio/compare/v3.0.2...v3.1.0) (2018-06-05)


### Bug Fixes

* groups are not array were not handled ([a62688f](https://github.com/verdaccio/verdaccio/commit/a62688f))
* improve bundle size ([a79d87b](https://github.com/verdaccio/verdaccio/commit/a79d87b))


### Features

* add published date and license on ui ([ecbe616](https://github.com/verdaccio/verdaccio/commit/ecbe616))
* using code splitting on routers ([0af6f5a](https://github.com/verdaccio/verdaccio/commit/0af6f5a))



<a name="3.0.2"></a>
## [3.0.2](https://github.com/verdaccio/verdaccio/compare/v3.0.1...v3.0.2) (2018-05-31)


### Bug Fixes

* enable audit by default ([8df186c](https://github.com/verdaccio/verdaccio/commit/8df186c))
* skip problematic unit test ([c920fa3](https://github.com/verdaccio/verdaccio/commit/c920fa3))



<a name="3.0.1"></a>
## [3.0.1](https://github.com/verdaccio/verdaccio/compare/v3.0.0...v3.0.1) (2018-05-31)


### Bug Fixes

* ui fails to render whether time is missing ([f575b48](https://github.com/verdaccio/verdaccio/commit/f575b48))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/verdaccio/verdaccio/compare/v3.0.0-beta.12...v3.0.0) (2018-05-30)


### Bug Fixes

* favicon refers to .png while only .ico exists [#681](https://github.com/verdaccio/verdaccio/issues/681) ([11e6f9f](https://github.com/verdaccio/verdaccio/commit/11e6f9f))
* web-ui css were not being minimized ([3168a76](https://github.com/verdaccio/verdaccio/commit/3168a76))


### Features

* new verdaccio skin to webui ([b8b2612](https://github.com/verdaccio/verdaccio/commit/b8b2612))



<a name="3.0.0-beta.12"></a>
# [3.0.0-beta.12](https://github.com/verdaccio/verdaccio/compare/v3.0.0-beta.11...v3.0.0-beta.12) (2018-05-23)


### Features

* add node 10 support for test and docker ([cee2564](https://github.com/verdaccio/verdaccio/commit/cee2564))
* support for npm audit fix [#689](https://github.com/verdaccio/verdaccio/issues/689) ([f9f180d](https://github.com/verdaccio/verdaccio/commit/f9f180d))



<a name="3.0.0-beta.11"></a>
# [3.0.0-beta.11](https://github.com/verdaccio/verdaccio/compare/v3.0.0-beta.10...v3.0.0-beta.11) (2018-05-20)


### Bug Fixes

* **docs:** clarify usage of uplink auth property ([01f7969](https://github.com/verdaccio/verdaccio/commit/01f7969))
* remove useless warning ignoring tag ([0aeac06](https://github.com/verdaccio/verdaccio/commit/0aeac06))



<a name="3.0.0-beta.10"></a>
# [3.0.0-beta.10](https://github.com/verdaccio/verdaccio/compare/v3.0.0-beta.9...v3.0.0-beta.10) (2018-05-14)


### Bug Fixes

* avoid issues with missing token [#693](https://github.com/verdaccio/verdaccio/issues/693) ([08f6a64](https://github.com/verdaccio/verdaccio/commit/08f6a64))


### Features

* return latest dis-tag readme whether main metadata readme is emtpy ([e75376b](https://github.com/verdaccio/verdaccio/commit/e75376b))



<a name="3.0.0-beta.9"></a>
# [3.0.0-beta.9](https://github.com/verdaccio/verdaccio/compare/v3.0.0-beta.8...v3.0.0-beta.9) (2018-05-13)


### Bug Fixes

* update dependencies [#691](https://github.com/verdaccio/verdaccio/issues/691) ([d07bfc5](https://github.com/verdaccio/verdaccio/commit/d07bfc5))
* vulnerabilities dependencies ([d4722d6](https://github.com/verdaccio/verdaccio/commit/d4722d6))
* vulnerabilities with lodash ([bcf128e](https://github.com/verdaccio/verdaccio/commit/bcf128e))



<a name="3.0.0-beta.8"></a>
# [3.0.0-beta.8](https://github.com/verdaccio/verdaccio/compare/v3.0.0-beta.7...v3.0.0-beta.8) (2018-05-09)


### Bug Fixes

* allow do not include storage if uses a storage plugin ([4332ffc](https://github.com/verdaccio/verdaccio/commit/4332ffc))
* disable autocomplete on search so it doesn't default to username ([2e41d9f](https://github.com/verdaccio/verdaccio/commit/2e41d9f))
* make enter key submit the login modal form ([f89b498](https://github.com/verdaccio/verdaccio/commit/f89b498))



<a name="3.0.0-beta.7"></a>
# [3.0.0-beta.7](https://github.com/verdaccio/verdaccio/compare/v3.0.0-beta.6...v3.0.0-beta.7) (2018-04-30)


### Bug Fixes

* beta header ([102fa22](https://github.com/verdaccio/verdaccio/commit/102fa22))
* enforce maximum amount of users for new users only ([4d19d7d](https://github.com/verdaccio/verdaccio/commit/4d19d7d))
* package command build:webui breaks on non-unix platforms ([4ec81d4](https://github.com/verdaccio/verdaccio/commit/4ec81d4))
* restore plugin loader ([3c1c3ca](https://github.com/verdaccio/verdaccio/commit/3c1c3ca))
* should fix flow performance issues ([453891b](https://github.com/verdaccio/verdaccio/commit/453891b))
* update memory plugin ([a7aa77a](https://github.com/verdaccio/verdaccio/commit/a7aa77a))
* update memory plugin for e2e ([df418a8](https://github.com/verdaccio/verdaccio/commit/df418a8))
* update memory storage plugin ([a75b7bd](https://github.com/verdaccio/verdaccio/commit/a75b7bd))
* update types ([4d5e8aa](https://github.com/verdaccio/verdaccio/commit/4d5e8aa))
* update uplinks auth header ([3f6eeb4](https://github.com/verdaccio/verdaccio/commit/3f6eeb4)), closes [#670](https://github.com/verdaccio/verdaccio/issues/670)
* upgrade webpack to v4. fixes [[#544](https://github.com/verdaccio/verdaccio/issues/544)] ([b1c631c](https://github.com/verdaccio/verdaccio/commit/b1c631c))



<a name="3.0.0-beta.6"></a>
# [3.0.0-beta.6](https://github.com/verdaccio/verdaccio/compare/v3.0.0-beta.5...v3.0.0-beta.6) (2018-04-03)


### Bug Fixes

* api login use case when user already exist ([6491db4](https://github.com/verdaccio/verdaccio/commit/6491db4))


### Features

* update verdaccio-htpasswd plugin ([3a9c994](https://github.com/verdaccio/verdaccio/commit/3a9c994))



<a name="3.0.0-beta.5"></a>
# [3.0.0-beta.5](https://github.com/verdaccio/verdaccio/compare/v3.0.0-beta.4...v3.0.0-beta.5) (2018-03-26)


### Bug Fixes

* adds debounce to search api call ([aa60e1d](https://github.com/verdaccio/verdaccio/commit/aa60e1d))
* **test:** replaces LocaleString with date-nfs/format ([0d3cf84](https://github.com/verdaccio/verdaccio/commit/0d3cf84))
* correct linter errors and warnings ([5c5af27](https://github.com/verdaccio/verdaccio/commit/5c5af27))
* display logo ([cbf4b9c](https://github.com/verdaccio/verdaccio/commit/cbf4b9c))
* login with fetch ([f338ee4](https://github.com/verdaccio/verdaccio/commit/f338ee4))
* unit test and better error handling ([2022a30](https://github.com/verdaccio/verdaccio/commit/2022a30))


### Features

* remove web logout endpoint ([badc707](https://github.com/verdaccio/verdaccio/commit/badc707))



<a name="3.0.0-beta.4"></a>
# [3.0.0-beta.4](https://github.com/verdaccio/verdaccio/compare/v3.0.0-beta.2...v3.0.0-beta.4) (2018-03-18)


### Bug Fixes

* add teardown for unit test ([036120b](https://github.com/verdaccio/verdaccio/commit/036120b))


### Features

* add strict_ssl_option, fixes [#587](https://github.com/verdaccio/verdaccio/issues/587) ([f0fef44](https://github.com/verdaccio/verdaccio/commit/f0fef44))

<a name="3.0.0-alpha.0"></a>
# [3.0.0-alpha.0](https://github.com/verdaccio/verdaccio/compare/v3.0.0-0...v3.0.0-alpha.0) (2018-01-07)


<a name="2.7.2"></a>
## [2.7.2](https://github.com/verdaccio/verdaccio/compare/v2.7.1...v2.7.2) (2018-01-05)


### Bug Fixes

* marked dependency to latest ([75bf2a8](https://github.com/verdaccio/verdaccio/commit/75bf2a8))



<a name="2.7.1"></a>
## [2.7.1](https://github.com/verdaccio/verdaccio/compare/v2.7.0...v2.7.1) (2017-12-20)


### Bug Fixes

* notification for multiple endpoints ([b605d1e](https://github.com/verdaccio/verdaccio/commit/b605d1e))



<a name="2.7.0"></a>
# [2.7.0](https://github.com/verdaccio/verdaccio/compare/v2.6.6...v2.7.0) (2017-12-05)


### Features

* Add middleware plugins from fl4re/sinopia ([374a5e8](https://github.com/verdaccio/verdaccio/commit/374a5e8))
* Log-rotation used to require a full restart of the application  ([baa4763](https://github.com/verdaccio/verdaccio/commit/baa4763)
* Add Kubernetes instructions ([ef1bd34](https://github.com/verdaccio/verdaccio/commit/ef1bd34)
* Match shell title with web title ([ddcc493](https://github.com/verdaccio/verdaccio/commit/ddcc493)


<a name="2.6.6"></a>
## [2.6.6](https://github.com/verdaccio/verdaccio/compare/v2.6.5...v2.6.6) (2017-11-08)


### Bug Fixes

* :bug: incorrect logo url with slash at the end of `url_prefix` ([859eccb](https://github.com/verdaccio/verdaccio/commit/859eccb))



<a name="2.6.5"></a>
## [2.6.5](https://github.com/verdaccio/verdaccio/compare/v2.6.4...v2.6.5) (2017-11-05)


### Bug Fixes

* upgrade node to fix long standing socket timeout issue ([bcc13ac](https://github.com/verdaccio/verdaccio/commit/bcc13ac))



<a name="2.6.4"></a>
## [2.6.4](https://github.com/verdaccio/verdaccio/compare/v2.6.3...v2.6.4) (2017-10-31)


### Bug Fixes

* :bug: incorrect resource and registry url while install on sub directory ([67e97a1](https://github.com/verdaccio/verdaccio/commit/67e97a1))



<a name="2.6.3"></a>
## [2.6.3](https://github.com/verdaccio/verdaccio/compare/v2.6.2...v2.6.3) (2017-10-21)


### Bug Fixes

* Check if socket exists before removing ([e916a0f](https://github.com/verdaccio/verdaccio/commit/e916a0f))



<a name="2.6.2"></a>
## [2.6.2](https://github.com/verdaccio/verdaccio/compare/v2.6.1...v2.6.2) (2017-10-21)


### Bug Fixes

* Remove unix socket before listen ([d42a41e](https://github.com/verdaccio/verdaccio/commit/d42a41e))



<a name="2.6.1"></a>
## [2.6.1](https://github.com/verdaccio/verdaccio/compare/v2.6.0...v2.6.1) (2017-10-19)



<a name="2.6.0"></a>
# [2.6.0](https://github.com/verdaccio/verdaccio/compare/v2.5.1...v2.6.0) (2017-10-18)


### Bug Fixes

* plugin loader with logs ([d6ed202](https://github.com/verdaccio/verdaccio/commit/d6ed202))


### Features

* add pfx support for https ([c84d567](https://github.com/verdaccio/verdaccio/commit/c84d567))



<a name="2.5.1"></a>
## [2.5.1](https://github.com/verdaccio/verdaccio/compare/v2.5.0...v2.5.1) (2017-10-01)


### Bug Fixes

* fix docker build failure due breaking changes in yarn ([c62e90f](https://github.com/verdaccio/verdaccio/commit/c62e90f))



<a name="2.5.0"></a>
# [2.5.0](https://github.com/verdaccio/verdaccio/compare/v2.3.6...v2.5.0) (2017-10-01)


### Bug Fixes

* :bug: check error code to prevent data loss ([5d73dca](https://github.com/verdaccio/verdaccio/commit/5d73dca)) fix [#329](https://github.com/verdaccio/verdaccio/issues/329)
* Fix  [#334](https://github.com/verdaccio/verdaccio/issues/334) UI failure on IE 11, add suppor for old browsers. ([f1f15be](https://github.com/verdaccio/verdaccio/commit/f1f15be))


### Features

* header authorization uplink ([7baf7cb](https://github.com/verdaccio/verdaccio/commit/7baf7cb))


<a name="2.4.0"></a>
# [2.4.0](https://github.com/verdaccio/verdaccio/compare/v2.3.6...v2.4.0) (2017-09-23)


### Bug Fixes

* :bug: check error code to prevent data loss ([5d73dca](https://github.com/verdaccio/verdaccio/commit/5d73dca))
* :bug: check error code to prevent data loss ([93aae05](https://github.com/verdaccio/verdaccio/commit/93aae05))
* :bug: Package metadata cache not work ([4d6a447](https://github.com/verdaccio/verdaccio/commit/4d6a447))
* Fixed bug with Maximum call stack size exceeded on packages web API ([#326](https://github.com/verdaccio/verdaccio/pull/326))
* fix: :bug: Package metadata cache does not work ([#317](https://github.com/verdaccio/verdaccio/pull/317))
* Debug log color in terminal is too dark ([#311](https://github.com/verdaccio/verdaccio/pull/311))
* docs: Add new sections to documentation ([#308](https://github.com/verdaccio/verdaccio/pull/308))
* Remove from web section not longer valid properties ([#307](https://github.com/verdaccio/verdaccio/pull/307)) ([#309](https://github.com/verdaccio/verdaccio/pull/309))
* Fix possible data loss upstream ([#306](https://github.com/verdaccio/verdaccio/pull/306)) ([#300](https://github.com/verdaccio/verdaccio/pull/300))


### Features

* Update node alpine version to 8.4.0 ([3f96ce3](https://github.com/verdaccio/verdaccio/commit/3f96ce3))



<a name="2.3.6"></a>
## [2.3.6](https://github.com/verdaccio/verdaccio/compare/v2.3.5...v2.3.6) (2017-08-17)


### Bug Fixes

* link was broken ([a9481cc](https://github.com/verdaccio/verdaccio/commit/a9481cc))
* Correct accept header set for registry requests ([#295](https://github.com/verdaccio/verdaccio/pull/295))
* Update SSL documentation ([#296](https://github.com/verdaccio/verdaccio/pull/296))
* Fix auth process to check against username also and not just groups ([#293](https://github.com/verdaccio/verdaccio/pull/293))



<a name="2.3.5"></a>
## [2.3.5](https://github.com/verdaccio/verdaccio/compare/v2.3.4...v2.3.5) (2017-08-14)


### Bug Fixes

* configuration files inconsistencies, add unit test ([644c098](https://github.com/verdaccio/verdaccio/commit/644c098))
* Remove accept header that seems cause issues [#285](https://github.com/verdaccio/verdaccio/issues/285) [#289](https://github.com/verdaccio/verdaccio/issues/289) and npm search fails ([fab8391](https://github.com/verdaccio/verdaccio/commit/fab8391))



<a name="2.3.4"></a>
## [2.3.4](https://github.com/verdaccio/verdaccio/compare/v2.3.3...v2.3.4) (2017-07-29)


### Bug Fixes

* Docker image fails due lock file localhost references ([901a7be](https://github.com/verdaccio/verdaccio/commit/901a7be))



<a name="2.3.3"></a>
## [2.3.3](https://github.com/verdaccio/verdaccio/compare/v2.3.2...v2.3.3) (2017-07-29)


### Bug Fixes

* refactor [#268](https://github.com/verdaccio/verdaccio/issues/268) in a better way, amended to elegant way ([94fb6ad](https://github.com/verdaccio/verdaccio/commit/94fb6ad))



<a name="2.3.2"></a>
## [2.3.2](https://github.com/verdaccio/verdaccio/compare/v2.3.0...v2.3.2) (2017-07-28)


### Bug Fixes

* :bug: detail page can't handle scoped package ([1c9fbfc](https://github.com/verdaccio/verdaccio/commit/1c9fbfc))
* [#268](https://github.com/verdaccio/verdaccio/issues/268) remove the accept header that avoids request with some regiestries ([e7dcf3c](https://github.com/verdaccio/verdaccio/commit/e7dcf3c))
* [#78](https://github.com/verdaccio/verdaccio/issues/78) add new setting to allow publish when uplinks are offline ([430425c](https://github.com/verdaccio/verdaccio/commit/430425c))
* broken link ([9fb0e14](https://github.com/verdaccio/verdaccio/commit/9fb0e14))
* lint warning ([d0afe78](https://github.com/verdaccio/verdaccio/commit/d0afe78))
* Param web.title from config.yaml does not work on docker image [#265](https://github.com/verdaccio/verdaccio/issues/265) ([b1a396d](https://github.com/verdaccio/verdaccio/commit/b1a396d))
* undefined check ([ff96d2e](https://github.com/verdaccio/verdaccio/commit/ff96d2e))



## 2.3.1 (July 25, 2017)

- bug: Detail page can't handle scoped package - [#261](https://github.com/verdaccio/verdaccio/pull/261)
- bug: can't publish a private package to verdaccio while offline - [#223](https://github.com/verdaccio/verdaccio/pull/223)
- refactor: use light version of syntax highlighter - [#260](https://github.com/verdaccio/verdaccio/pull/260)

## 2.3.0 (July 22, 2017)

- feature: Refactor User Interface - [#220](https://github.com/verdaccio/verdaccio/pull/220)

## 2.2.7 (July 18, 2017)

- bug: fix running behind of loadbalancer with TLS termination - [#254](https://github.com/verdaccio/verdaccio/pull/254)


## 2.2.6 (July 13, 2017)

- build: update node version due security update announcement - [#251](https://github.com/verdaccio/verdaccio/pull/251)

## 2.2.5 (July 4, 2017)

- Fixed adding the verdaccio user into the group - [#241](https://github.com/verdaccio/verdaccio/pull/241)

## 2.2.3 (July 4, 2017)

- Updated Dockerfile & added proper signal handling - [#239](https://github.com/verdaccio/verdaccio/pull/239)

## 2.2.2 (July 2, 2017)

- Improve Docker Build - [#181](https://github.com/verdaccio/verdaccio/pull/181)
- Bugfix #73 `npm-latest` support - [#228](https://github.com/verdaccio/verdaccio/pull/228)
- Add [documentation](https://github.com/verdaccio/verdaccio/tree/master/wiki) - [#229](https://github.com/verdaccio/verdaccio/pull/229)   

## 2.2.1 (June 17, 2017)

- config section moved up, some keywords added - [#211](https://github.com/verdaccio/verdaccio/pull/211)
- docs: update docs with behind reverse proxy - [#214](https://github.com/verdaccio/verdaccio/pull/214)
- Add remote ip to request log - [#216](https://github.com/verdaccio/verdaccio/pull/216)

## 2.2.0 (June 8, 2017)
- Allow url_prefix to be only the path - ([@BartDubois ]((https://github.com/BartDubois))) in [#197](https://github.com/verdaccio/verdaccio/pull/197)
- Apache reverse proxy configuration - ([@mysiar ]((https://github.com/mysiar))) in [#198](https://github.com/verdaccio/verdaccio/pull/198)
- don't blindly clobber local dist-tags - ([@rmg ]((https://github.com/rmg))) in [#206](https://github.com/verdaccio/verdaccio/pull/206)
- Adds cache option to uplinks - ([@silkentrance ]((https://github.com/silkentrance))) in [#132](https://github.com/verdaccio/verdaccio/pull/132)

## 2.1.7 (May 14, 2017)
- Fixed publish fail in YARN - ([@W1U02]((https://github.com/W1U02)) in [#183](https://github.com/verdaccio/verdaccio/pull/183)

## 2.1.6 (May 12, 2017)
- Fix https certificates safety check - ([@juanpicado]((https://github.com/juanpicado))) in [#189](https://github.com/verdaccio/verdaccio/pull/189)
- Fix upstream search not work with gzip - ([@Meeeeow](https://github.com/Meeeeow) in [#170](https://github.com/verdaccio/verdaccio/pull/170))
- Add additional requirement to output message - ([@marnel ](https://github.com/marnel) in [#184](https://github.com/verdaccio/verdaccio/pull/184))
- Implement npm ping endpoint - ([@juanpicado]((https://github.com/juanpicado))) in [#179](https://github.com/verdaccio/verdaccio/pull/179)
- Add support for multiple notification endpoints to existing webhook - ([@ryan-codingintrigue]((https://github.com/ryan-codingintrigue))) 
in [#108](https://github.com/verdaccio/verdaccio/pull/108)



## 2.1.5 (April 22, 2017)
- fix upstream search - ([@Meeeeow](https://github.com/Meeeeow) in [#166](https://github.com/verdaccio/verdaccio/pull/166))
- Fix search feature - ([@Meeeeow](https://github.com/Meeeeow) in [#163](https://github.com/verdaccio/verdaccio/pull/163))
- add docs about run behind proxy - ([@Meeeeow](https://github.com/Meeeeow) in [#160](https://github.com/verdaccio/verdaccio/pull/160))

## 2.1.4 (April 13, 2017)
- Added Nexus Repository OSS as similar existing software - ([@nedelenbos030](https://github.com/nedelenbos) in [#147](https://github.com/verdaccio/verdaccio/pull/147))
- Increase verbose on notify request - ([@juanpicado](https://github.com/juanpicado) in [#153](https://github.com/verdaccio/verdaccio/pull/153))
- Add fallback support to previous config files - ([@juanpicado](https://github.com/juanpicado) in [#155](https://github.com/verdaccio/verdaccio/pull/155))
- Allows retrieval of all local package contents via http://server/-/search/* - ([@Verikon](https://github.com/Verikon) in [#152](https://github.com/verdaccio/verdaccio/pull/155))

## 2.1.3 (March 29, 2017)
- [GH-83] create systemd service - ([@030](https://github.com/030) in [#89](https://github.com/verdaccio/verdaccio/pull/89))
- optional scope in the readme package name. - ([@psychocode](https://github.com/psychocode) in [#136](https://github.com/verdaccio/verdaccio/pull/136))
- Added docker image for rpi - ([@danielo515](https://github.com/danielo515) in [#137](https://github.com/verdaccio/verdaccio/pull/137))
- Allow configuring a tagline that is displayed on the webpage between. ([@jachstet-sea](https://github.com/jachstet-sea) in [#143](https://github.com/verdaccio/verdaccio/pull/143))

## 2.1.2 (March 9, 2017)
- Contribute guidelines - ([@juanpicado](https://github.com/juanpicado) in [#133](https://github.com/verdaccio/verdaccio/pull/133))
- fix(plugin-loader): plugins verdaccio-* overwrite by sinopia- ([@Alexandre-io](https://github.com/Alexandre-io) in [#129](https://github.com/verdaccio/verdaccio/pull/129))

## 2.1.1 (February 7, 2017)

- [GH-86] updated readme to point to new chef cookbook ([@kgrubb](https://github.com/kgrubb) in [#117](https://github.com/verdaccio/verdaccio/pull/117))
- [GH-88] rename to Verdaccio instead of Sinopia ([@kgrubb](https://github.com/kgrubb) in [#93](https://github.com/verdaccio/verdaccio/pull/93))
- Unit testing coverage ([@juanpicado](https://github.com/juanpicado) in [#116](https://github.com/verdaccio/verdaccio/issues/116))
- Allow htpasswd-created users to log in [@imsnif](https://github.com/imsnif) in [#112](https://github.com/verdaccio/verdaccio/issues/112))
- remove travis io.js support ([@juanpicado](https://github.com/juanpicado) in [#115](https://github.com/verdaccio/verdaccio/issues/115))
- rename clean up ([@juanpicado](https://github.com/juanpicado) in [#114](https://github.com/verdaccio/verdaccio/issues/114))
- _npmUser / author not showing up ([@juanpicado](https://github.com/juanpicado) in [#65](https://github.com/verdaccio/verdaccio/issues/65))
- Docs: correct config attribute `proxy_access` ([@robertgroh](https://github.com/robertgroh) in [#96](https://github.com/verdaccio/verdaccio/pull/96))
- Problem with docker.yaml ([@josedepaz](https://github.com/josedepaz) in [#72](https://github.com/verdaccio/verdaccio/pull/72)) 
- Prevent logging of user and password ([@tlvince](https://github.com/tlvince) in [#94](https://github.com/verdaccio/verdaccio/pull/94))
- Updated README.md to reflect the availability of the docker image ([@jmwilkinson](https://github.com/jmwilkinson)) in [#71](https://github.com/verdaccio/verdaccio/pull/71)) 

## 2.1.0 (October 11, 2016)

- Use __dirname to resolve local plugins ([@aledbf](https://github.com/aledbf) in [#25](https://github.com/verdaccio/verdaccio/pull/25))
- Fix npm cli logout ([@plitex](https://github.com/plitex) in [#47](https://github.com/verdaccio/verdaccio/pull/47))
- Add log format: pretty-timestamped ([@jachstet-sea](https://github.com/jachstet-sea) in [#68](https://github.com/verdaccio/verdaccio/pull/68))
- Allow adding/overriding HTTP headers of uplinks via config ([@jachstet-sea](https://github.com/jachstet-sea) in [#67](https://github.com/verdaccio/verdaccio/pull/67))
- Update Dockerfile to fix failed start ([@denisbabineau](https://github.com/denisbabineau) in [#62](https://github.com/verdaccio/verdaccio/pull/62))
- Update the configs to fully support proxying scoped packages ([@ChadKillingsworth](https://github.com/ChadKillingsworth) in [#60](https://github.com/verdaccio/verdaccio/pull/60))
- Prevent the server from crashing if a repo is accessed that the user does not have access to ([@crowebird](https://github.com/crowebird) in [#58](https://github.com/verdaccio/verdaccio/pull/58))
- Hook system, for integration into things like slack
- Register entry partial even if custom template is provided ([@plitex](https://github.com/plitex) in [#46](https://github.com/verdaccio/verdaccio/pull/46))
- Rename process to verdaccio ([@juanpicado](https://github.com/juanpicado) in [#57](https://github.com/verdaccio/verdaccio/pull/57))


## 7 Jun 2015, version 1.4.0

- avoid sending X-Forwarded-For through proxies (issues [#19](https://github.com/rlidwka/sinopia/issues/19), [#254](https://github.com/rlidwka/sinopia/issues/254))
- fix multiple issues in search (issues [#239](https://github.com/rlidwka/sinopia/issues/239), [#253](https://github.com/rlidwka/sinopia/pull/253))
- fix "maximum stack trace exceeded" errors in auth (issue [#258](https://github.com/rlidwka/sinopia/issues/258))

## 10 May 2015, version 1.3.0

- add dist-tags endpoints (issue [#211](https://github.com/rlidwka/sinopia/issues/211))

## 22 Apr 2015, version 1.2.2

- fix access control regression in `1.2.1` (issue [#238](https://github.com/rlidwka/sinopia/issues/238))
- add a possibility to bind on unix sockets (issue [#237](https://github.com/rlidwka/sinopia/issues/237))

## 11 Apr 2015, version 1.2.1

- added more precise authorization control to auth plugins (issue [#207](https://github.com/rlidwka/sinopia/pull/207))

## 29 Mar 2015, version 1.1.0

- add a possibility to listen on multiple ports (issue [#172](https://github.com/rlidwka/sinopia/issues/172))
- added https support (issues [#71](https://github.com/rlidwka/sinopia/issues/71), [#166](https://github.com/rlidwka/sinopia/issues/166))
- added an option to use a custom template for web UI (issue [#208](https://github.com/rlidwka/sinopia/pull/208))
- remove "from" and "resolved" fields from shrinkwrap (issue [#204](https://github.com/rlidwka/sinopia/issues/204))
- fix hanging when rendering readme (issue [#206](https://github.com/rlidwka/sinopia/issues/206))
- fix logger-related crash when using sinopia as a library
- all requests to uplinks should now have proper headers

## 12 Feb 2015, version 1.0.1

- fixed issue with `max_users` option (issue [#184](https://github.com/rlidwka/sinopia/issues/184))
- fixed issue with not being able to disable the web interface (issue [#195](https://github.com/rlidwka/sinopia/pull/195))
- fixed 500 error while logging in with npm (issue [#200](https://github.com/rlidwka/sinopia/pull/200))

## 26 Jan 2015, version 1.0.0

- switch markdown parser from `remarkable` to `markdown-it`
- update `npm-shrinkwrap.json`
- now downloading tarballs from upstream using the same protocol as for metadata (issue [#166](https://github.com/rlidwka/sinopia/issues/166))

## 22 Dec 2014, version 1.0.0-beta.2

- fix windows behavior when `$HOME` isn't set (issue [#177](https://github.com/rlidwka/sinopia/issues/177))
- fix sanitization for highlighted code blocks in readme (issue [render-readme/#1](https://github.com/rlidwka/render-readme/issues/1))

## 15 Dec 2014, version 1.0.0-beta

- Markdown rendering is now a lot safer (switched to remarkable+sanitizer).
- Header in web interface is now static instead of fixed.
- `GET /-/all?local` now returns list of all local packages (issue [#179](https://github.com/rlidwka/sinopia/pull/179))

## 5 Dec 2014, version 1.0.0-alpha.3

- Fixed an issue with scoped packages in tarballs

## 25 Nov 2014, version 1.0.0-alpha

- Config file is now created in `$XDG_CONFIG_HOME` instead of current directory. 

  It is printed to stdout each time sinopia starts, so you hopefully won't have any trouble locating it.

  The change is made so sinopia will pick up the same config no matter which directory it is started from.

- Default config file is now a lot shorter, and it is very permissive by default. You could use sinopia without modifying it on your own computer, but definitely should change it on production.

- Added auth tokens. For now, auth token is just a username+password encrypted for security reasons, so it isn't much different from basic auth, but allows to avoid "always-auth" npm setting.

- Added scoped packages.

  Please note that default `*` mask won't apply to them. You have to use masks like `@scope/*` to match scoped packages, or `**` to match everything.

- Enabled web interface by default. Wow, it looks almost ready now!

- All dependencies are bundled now, so uncompatible changes in 3rd party stuff in the future won't ruin the day.

## 1 Nov 2014, version 0.13.2

- fix `EPERM`-related crashes on windows (issue [#67](https://github.com/rlidwka/sinopia/issues/67))

## 22 Oct 2014, version 0.13.0

- web interface:
  - web page layout improved (issue [#141](https://github.com/rlidwka/sinopia/pull/141))
  - latest version is now displayed correctly (issues [#120](https://github.com/rlidwka/sinopia/issues/120), [#123](https://github.com/rlidwka/sinopia/issues/123), [#143](https://github.com/rlidwka/sinopia/pull/143))
  - fixed web interface working behind reverse proxy (issues [#145](https://github.com/rlidwka/sinopia/issues/145), [#147](https://github.com/rlidwka/sinopia/issues/147))

## 2 Oct 2014, version 0.12.1

- web interface:
  - update markdown CSS (issue [#137](https://github.com/rlidwka/sinopia/pull/137))
  - jquery is now served locally (issue [#133](https://github.com/rlidwka/sinopia/pull/133))

- bugfixes:
  - fix "offset out of bounds" issues (issue [sinopia-htpasswd/#2](https://github.com/rlidwka/sinopia-htpasswd/issues/2))
  - "max_users" in htpasswd plugin now work correctly (issue [sinopia-htpasswd/#3](https://github.com/rlidwka/sinopia-htpasswd/issues/3))
  - fix `ENOTDIR, open '.sinopia-db.json'` error in npm search (issue [#122](https://github.com/rlidwka/sinopia/issues/122))

## 25 Sep 2014, version 0.12.0

- set process title to `sinopia`

- web interface bugfixes:
  - save README data for each package (issue [#100](https://github.com/rlidwka/sinopia/issues/100))
  - fix crashes related to READMEs (issue [#128](https://github.com/rlidwka/sinopia/issues/128))

## 18 Sep 2014, version 0.11.3

- fix 500 error in adduser function in sinopia-htpasswd (issue [#121](https://github.com/rlidwka/sinopia/issues/121))
- fix fd leak in authenticate function in sinopia-htpasswd (issue [#116](https://github.com/rlidwka/sinopia/issues/116))

## 15 Sep 2014, version 0.11.1

- mark crypt3 as optional (issue [#119](https://github.com/rlidwka/sinopia/issues/119))

## 15 Sep 2014, version 0.11.0

- Added auth plugins (issue [#99](https://github.com/rlidwka/sinopia/pull/99))

  Now you can create your own auth plugin based on [sinopia-htpasswd](https://github.com/rlidwka/sinopia-htpasswd) package.

- WIP: web interface (issue [#73](https://github.com/rlidwka/sinopia/pull/73))

  It is disabled by default, and not ready for production yet. Use at your own risk. We will enable it in the next major release.

- Some modules are now bundled by default, so users won't have to install stuff from git. We'll see what issues it causes, maybe all modules will be bundled in the future like in npm.

## 14 Sep 2014, version 0.10.x

*A bunch of development releases that are broken in various ways. Please use 0.11.x instead.*

## 7 Sep 2014, version 0.9.3

- fix several bugs that could cause "can't set headers" exception

## 3 Sep 2014, version 0.9.2

- allow "pretty" format for logging into files (issue [#88](https://github.com/rlidwka/sinopia/pull/88))
- remove outdated user existence check (issue [#115](https://github.com/rlidwka/sinopia/pull/115))

## 11 Aug 2014, version 0.9.1

- filter falsey _npmUser values (issue [#95](https://github.com/rlidwka/sinopia/pull/95))
- option not to cache third-party files (issue [#85](https://github.com/rlidwka/sinopia/issues/85))

## 26 Jul 2014, version 0.9.0

- new features:
  - add search functionality (issue [#65](https://github.com/rlidwka/sinopia/pull/65))
  - allow users to authenticate using .htpasswd (issue [#44](https://github.com/rlidwka/sinopia/issues/44))
  - allow user registration with "npm adduser" (issue [#44](https://github.com/rlidwka/sinopia/issues/44))

- bugfixes:
  - avoid crashing when res.socket is null (issue [#89](https://github.com/rlidwka/sinopia/issues/89))

## 20 Jun 2014, version 0.8.2

- allow '@' in package/tarball names (issue [#75](https://github.com/rlidwka/sinopia/issues/75))
- other minor fixes (issues [#77](https://github.com/rlidwka/sinopia/issues/77), [#80](https://github.com/rlidwka/sinopia/issues/80))

## 14 Apr 2014, version 0.8.1

- "latest" tag is now always present in any package (issue [#63](https://github.com/rlidwka/sinopia/issues/63))
- tags created with new npm versions (>= 1.3.19) can now be published correctly

## 1 Apr 2014, version 0.8.0

- use gzip compression whenever possible (issue [#54](https://github.com/rlidwka/sinopia/issues/54))
- set `ignore_latest_tag` to false, it should now be more compatible with npm registry
- make `fs-ext` optional (issue [#61](https://github.com/rlidwka/sinopia/issues/61))

## 29 Mar 2014, version 0.7.1

- added `ignore_latest_tag` config param (issues [#55](https://github.com/rlidwka/sinopia/issues/55), [#59](https://github.com/rlidwka/sinopia/issues/59))
- reverted PR [#56](https://github.com/rlidwka/sinopia/issues/56) (see discussion in [#57](https://github.com/rlidwka/sinopia/issues/57))

## 13 Mar 2014, version 0.7.0

- config changes:
  - breaking change: all time intervals are now specified in *seconds* instead of *milliseconds* for the sake of consistency. Change `timeout` if you have one!
  - all time intervals now can be specified in [nginx notation](http://wiki.nginx.org/ConfigNotation), for example `1m 30s` will specify a 90 seconds timeout
  - added `maxage` option to avoid asking public registry for the same data too often (issue [#47](https://github.com/rlidwka/sinopia/issues/47))
  - added `max_fails` and `fail_timeout` options to reduce amount of requests to public registry when it's down (issue [#7](https://github.com/rlidwka/sinopia/issues/7))

- bug fixes:
  - fix crash when headers are sent twice (issue [#52](https://github.com/rlidwka/sinopia/issues/52))
  - all tarballs are returned with `Content-Length`, which allows [yapm](https://github.com/rlidwka/yapm) to estimate download time
  - when connection to public registry is interrupted when downloading a tarball, we no longer save incomplete tarball to the disk

- other changes:
  - 404 errors are returned in couchdb-like manner (issue [#56](https://github.com/rlidwka/sinopia/issues/56))

## 5 Mar 2014, version 0.6.7

- pin down express@3 version, since sinopia doesn't yet work with express@4

## 28 Feb 2014, version 0.6.5

- old SSL keys for npm are removed, solves `SELF_SIGNED_CERT_IN_CHAIN` error

## 3 Feb 2014, version 0.6.3

- validate tags and versions (issue [#40](https://github.com/rlidwka/sinopia/issues/40))
- don't crash when process.getuid doesn't exist (issue [#41](https://github.com/rlidwka/sinopia/issues/41))

## 18 Jan 2014, version 0.6.2

- adding config param to specify upload limits (issue [#39](https://github.com/rlidwka/sinopia/issues/39))
- making loose semver versions work (issue [#38](https://github.com/rlidwka/sinopia/issues/38))

## 13 Jan 2014, version 0.6.1

- support setting different storage paths for different packages (issue [#35](https://github.com/rlidwka/sinopia/issues/35))

## 30 Dec 2013, version 0.6.0

- tag support (issue [#8](https://github.com/rlidwka/sinopia/issues/8))
- adding support for npm 1.3.19+ behaviour (issue [#31](https://github.com/rlidwka/sinopia/issues/31))
- removing all support for proxying publish requests to uplink (too complex)

## 26 Dec 2013, version 0.5.9

- fixing bug with bad Accept header (issue [#32](https://github.com/rlidwka/sinopia/issues/32))

## 20 Dec 2013, version 0.5.8

- fixed a warning from js-yaml
- don't color multiline strings in logs output
- better error messages in various cases
- test format changed

## 15 Dec 2013, version 0.5.7

- try to fetch package from uplinks if user requested a tarball we don't know about (issue [#29](https://github.com/rlidwka/sinopia/issues/29))
- security fix: set express.js to production mode so we won't return stack traces to the user in case of errors

## 11 Dec 2013, version 0.5.6

- fixing a few crashes related to tags

## 8 Dec 2013, version 0.5.4

- latest tag always shows highest version available (issue [#8](https://github.com/rlidwka/sinopia/issues/8))
- added a configurable timeout for requests to uplinks (issue [#18](https://github.com/rlidwka/sinopia/issues/18))
- users with bad authentication header are considered not logged in (issue [#17](https://github.com/rlidwka/sinopia/issues/17))

## 24 Nov 2013, version 0.5.3

- added proxy support for requests to uplinks (issue [#13](https://github.com/rlidwka/sinopia/issues/13))
- changed license from default BSD to WTFPL

## 26 Oct 2013, version 0.5.2

- server now supports unpublishing local packages
- added fs-ext dependency (flock)
- fixed a few face conditions

## 20 Oct 2013, version 0.5.1

- fixed a few errors related to logging

## 12 Oct 2013, version 0.5.0

- using bunyan as a log engine
- pretty-formatting colored logs to stdout by default
- ask user before creating any config files

## 5 Oct 2013, version 0.4.3

- basic tags support for npm (read-only)
- npm star/unstar calls now return proper error

## 29 Sep 2013, version 0.4.2

## 28 Sep 2013, version 0.4.1

- using mocha for tests now
- making use of streams2 api, doesn't work on 0.8 anymore
- basic support for uploading packages to other registries

## 27 Sep 2013, version 0.4.0

- basic test suite
- storage path in config is now relative to config file location, not cwd
- proper cleanup for temporary files

## 12 Jul 2013, version 0.3.2

## 4 Jul 2013, version 0.3.1

- using ETag header for all json output, based on md5

## 20 Jun 2013, version 0.3.0

- compression for http responses
- requests for files to uplinks are now streams (no buffering)
- tarballs are now cached locally

## 19 Jun 2013, version 0.2.0

- config file changed, packages is now specified with minimatch
- ability to retrieve all packages from another registry (i.e. npmjs)

## 14 Jun 2013, version 0.1.1

- config is now autogenerated
- tarballs are now read/written from fs using streams (no buffering)

## 9 Jun 2013, version 0.1.0

- first npm version
- ability to publish packages and retrieve them locally
- basic authentication/access control

## 22 May 2013, version 0.0.0

- first commits
