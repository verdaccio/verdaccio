# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [6.0.0-beta.2](https://github.com/verdaccio/verdaccio/compare/v6.0.0-beta.1...v6.0.0-beta.2) (2024-03-17)


### Features

* enable stream search from user interface ([#4544](https://github.com/verdaccio/verdaccio/issues/4544)) ([ed3ce4d](https://github.com/verdaccio/verdaccio/commit/ed3ce4dc93bf96fc262c0bf1e2d38537d66a6540))


### Bug Fixes

* **deps:** update core verdaccio dependencies ([#4436](https://github.com/verdaccio/verdaccio/issues/4436)) ([5a03778](https://github.com/verdaccio/verdaccio/commit/5a037785a1dbcd5f96be027a1f478bd8d2aadd90))
* **deps:** update core verdaccio dependencies ([#4500](https://github.com/verdaccio/verdaccio/issues/4500)) ([eda0f51](https://github.com/verdaccio/verdaccio/commit/eda0f513d07c808c6873b60a0f57caee757d5f13))
* **deps:** update core verdaccio dependencies ([#4531](https://github.com/verdaccio/verdaccio/issues/4531)) ([f46f9e1](https://github.com/verdaccio/verdaccio/commit/f46f9e1b70157b5ff0be7ff118614bd5a9c29e62))
* **deps:** update core verdaccio dependencies (6.x) ([#4540](https://github.com/verdaccio/verdaccio/issues/4540)) ([c12e1a0](https://github.com/verdaccio/verdaccio/commit/c12e1a0b6aa9c9e19b50b19fee143f939f43ed2a))
* newline after version command ([913ce37](https://github.com/verdaccio/verdaccio/commit/913ce37b57814961f8225a5cbd310166a130d4d4)), closes [#4543](https://github.com/verdaccio/verdaccio/issues/4543)
* profile v1 endpoint and tests ([a183446](https://github.com/verdaccio/verdaccio/commit/a183446000f683591fa96d0ea6b79b286de410f2))

## [6.0.0-beta.1](https://github.com/verdaccio/verdaccio/compare/v6.0.0-beta.0...v6.0.0-beta.1) (2024-01-07)


### Bug Fixes

* release script ([7e7b578](https://github.com/verdaccio/verdaccio/commit/7e7b57869e7006d32fa650a0125f080ec1b9387d))

## [6.0.0-beta.0](https://github.com/verdaccio/verdaccio/compare/v5.26.1...v6.0.0-beta.0) (2024-01-07)


### ⚠ BREAKING CHANGES

* using new plugin loader (#4097)
* drop nodejs 16 (#4032)
* remove request (#3960)
* drop Node.js 12 (#3983)

### Features

* drop Node.js 12 ([#3983](https://github.com/verdaccio/verdaccio/issues/3983)) ([5a0ead5](https://github.com/verdaccio/verdaccio/commit/5a0ead5fb6b14a8f26b79fb8a80f33931207ba51))
* drop nodejs 16 ([#4032](https://github.com/verdaccio/verdaccio/issues/4032)) ([02af45c](https://github.com/verdaccio/verdaccio/commit/02af45c8dbbb0afabc97e59fa993b2ff57872644))
* **experiment:** accept async tarball_url_redirect function ([#3914](https://github.com/verdaccio/verdaccio/issues/3914)) ([e174e8c](https://github.com/verdaccio/verdaccio/commit/e174e8c554e8c245bcde558ef94b5cb0bde1881c))
* refactor auth class ([#4364](https://github.com/verdaccio/verdaccio/issues/4364)) ([428a256](https://github.com/verdaccio/verdaccio/commit/428a25662674eca61a2410d7c86e6cd02694e0c3))
* remove request ([#3960](https://github.com/verdaccio/verdaccio/issues/3960)) ([d40d0ff](https://github.com/verdaccio/verdaccio/commit/d40d0ff7b3ee767b1be84220b9e145f78a92b7de))
* search on cache packages ([#4001](https://github.com/verdaccio/verdaccio/issues/4001)) ([c2aa0b6](https://github.com/verdaccio/verdaccio/commit/c2aa0b6d3fab964a93471adc47c8285a02f521c1))
* using new plugin loader ([#4097](https://github.com/verdaccio/verdaccio/issues/4097)) ([8a8a330](https://github.com/verdaccio/verdaccio/commit/8a8a3307a12285707d5a0751e5865b9d0debc54a))


### Bug Fixes

* check if node.js minimum version is correct ([#4002](https://github.com/verdaccio/verdaccio/issues/4002)) ([547ba9a](https://github.com/verdaccio/verdaccio/commit/547ba9a56932705896b7e9b03c8c581c863396b4))
* **deps:** update core verdaccio dependencies ([#4358](https://github.com/verdaccio/verdaccio/issues/4358)) ([f0c1a3f](https://github.com/verdaccio/verdaccio/commit/f0c1a3f7fda3fc95a44f564305227b80ecdd7fca))
* **deps:** update core verdaccio dependencies ([#4390](https://github.com/verdaccio/verdaccio/issues/4390)) ([4ee9878](https://github.com/verdaccio/verdaccio/commit/4ee987809b003a8d8827267a92ec86125046cc6b))
* **deps:** update dependency cookies to v0.9.0 ([#4342](https://github.com/verdaccio/verdaccio/issues/4342)) ([786c200](https://github.com/verdaccio/verdaccio/commit/786c20081fa9665c2411b791238af4b1a6d3f673))
* **deps:** update dependency validator to v13.11.0 ([#3967](https://github.com/verdaccio/verdaccio/issues/3967)) ([f61cfda](https://github.com/verdaccio/verdaccio/commit/f61cfda1c33a020bb1eddb99f0e606f5bf68b499))
* update docker image to v20.9.0 ([127e6cf](https://github.com/verdaccio/verdaccio/commit/127e6cf19ff77e593598b07a4c72e23d3075d5f2))
* update verdaccio core dependencies ([dc3fb46](https://github.com/verdaccio/verdaccio/commit/dc3fb46f76071be29accf1bb1a357474a2a7b0d6))
* update verdaccio core dependencies ([#4034](https://github.com/verdaccio/verdaccio/issues/4034)) ([4ddb220](https://github.com/verdaccio/verdaccio/commit/4ddb220ba50376ab158b5870215d81c5a5e4ea96))
