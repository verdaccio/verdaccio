---
id: 'modules'
title: '@verdaccio/core'
sidebar_label: 'Exports'
sidebar_position: 0.5
custom_edit_url: null
---

## Namespaces

- [constants](namespaces/constants.md)
- [errorUtils](namespaces/errorUtils.md)
- [fileUtils](namespaces/fileUtils.md)
- [pkgUtils](namespaces/pkgUtils.md)
- [pluginUtils](namespaces/pluginUtils.md)
- [searchUtils](namespaces/searchUtils.md)
- [streamUtils](namespaces/streamUtils.md)
- [stringUtils](namespaces/stringUtils.md)
- [validatioUtils](namespaces/validatioUtils.md)
- [warningUtils](namespaces/warningUtils.md)

## Enumerations

- [HtpasswdHashAlgorithm](enums/HtpasswdHashAlgorithm.md)

## Type Aliases

### VerdaccioError

Ƭ **VerdaccioError**: `HttpError` & { `code`: `number` }

#### Defined in

[error-utils.ts:57](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/error-utils.ts#L57)

## Variables

### API_ERROR

• `Const` **API_ERROR**: `Object`

#### Type declaration

| Name                          | Type     |
| :---------------------------- | :------- |
| `BAD_AUTH_HEADER`             | `string` |
| `BAD_DATA`                    | `string` |
| `BAD_FORMAT_USER_GROUP`       | `string` |
| `BAD_PACKAGE_DATA`            | `string` |
| `BAD_STATUS_CODE`             | `string` |
| `BAD_USERNAME_PASSWORD`       | `string` |
| `CONFIG_BAD_FORMAT`           | `string` |
| `CONTENT_MISMATCH`            | `string` |
| `DEPRECATED_BASIC_HEADER`     | `string` |
| `FILE_NOT_FOUND`              | `string` |
| `INTERNAL_SERVER_ERROR`       | `string` |
| `MAX_USERS_REACHED`           | `string` |
| `MUST_BE_LOGGED`              | `string` |
| `NOT_ALLOWED`                 | `string` |
| `NOT_ALLOWED_PUBLISH`         | `string` |
| `NOT_FILE_UPLINK`             | `string` |
| `NOT_MODIFIED_NO_DATA`        | `string` |
| `NOT_PACKAGE_UPLINK`          | `string` |
| `NO_PACKAGE`                  | `string` |
| `NO_SUCH_FILE`                | `string` |
| `PACKAGE_CANNOT_BE_ADDED`     | `string` |
| `PACKAGE_EXIST`               | `string` |
| `PASSWORD_SHORT`              | `string` |
| `PLUGIN_ERROR`                | `string` |
| `REGISTRATION_DISABLED`       | `string` |
| `RESOURCE_UNAVAILABLE`        | `string` |
| `SERVER_TIME_OUT`             | `string` |
| `UNAUTHORIZED_ACCESS`         | `string` |
| `UNKNOWN_ERROR`               | `string` |
| `UNSUPORTED_REGISTRY_CALL`    | `string` |
| `UPLINK_OFFLINE`              | `string` |
| `UPLINK_OFFLINE_PUBLISH`      | `string` |
| `USERNAME_ALREADY_REGISTERED` | `string` |
| `USERNAME_PASSWORD_REQUIRED`  | `string` |
| `VERSION_NOT_EXIST`           | `string` |
| `WEB_DISABLED`                | `string` |

#### Defined in

[error-utils.ts:5](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/error-utils.ts#L5)

---

### API_MESSAGE

• `Const` **API_MESSAGE**: `Object`

#### Type declaration

| Name               | Type     |
| :----------------- | :------- |
| `LOGGED_OUT`       | `string` |
| `OK`               | `string` |
| `PKG_CHANGED`      | `string` |
| `PKG_CREATED`      | `string` |
| `PKG_PUBLISHED`    | `string` |
| `PKG_REMOVED`      | `string` |
| `TAG_ADDED`        | `string` |
| `TAG_REMOVED`      | `string` |
| `TAG_UPDATED`      | `string` |
| `TARBALL_REMOVED`  | `string` |
| `TARBALL_UPLOADED` | `string` |

#### Defined in

[constants.ts:81](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/constants.ts#L81)

---

### APP_ERROR

• `Const` **APP_ERROR**: `Object`

#### Type declaration

| Name                  | Type     |
| :-------------------- | :------- |
| `CONFIG_NOT_VALID`    | `string` |
| `PASSWORD_VALIDATION` | `string` |
| `PROFILE_ERROR`       | `string` |

#### Defined in

[error-utils.ts:51](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/error-utils.ts#L51)

---

### CHARACTER_ENCODING

• `Const` **CHARACTER_ENCODING**: `Object`

#### Type declaration

| Name   | Type     |
| :----- | :------- |
| `UTF8` | `string` |

#### Defined in

[constants.ts:19](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/constants.ts#L19)

---

### DEFAULT_PASSWORD_VALIDATION

• `Const` **DEFAULT_PASSWORD_VALIDATION**: `RegExp`

#### Defined in

[constants.ts:3](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/constants.ts#L3)

---

### DEFAULT_USER

• `Const` **DEFAULT_USER**: `"Anonymous"`

#### Defined in

[constants.ts:9](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/constants.ts#L9)

---

### DIST_TAGS

• `Const` **DIST_TAGS**: `"dist-tags"`

#### Defined in

[constants.ts:6](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/constants.ts#L6)

---

### HEADERS

• `Const` **HEADERS**: `Object`

#### Type declaration

| Name                   | Type     |
| :--------------------- | :------- |
| `ACCEPT`               | `string` |
| `ACCEPT_ENCODING`      | `string` |
| `AUTHORIZATION`        | `string` |
| `CACHE_CONTROL`        | `string` |
| `CONTENT_LENGTH`       | `string` |
| `CONTENT_TYPE`         | `string` |
| `CSP`                  | `string` |
| `CTO`                  | `string` |
| `ETAG`                 | `string` |
| `FORWARDED_FOR`        | `string` |
| `FORWARDED_PROTO`      | `string` |
| `FRAMES_OPTIONS`       | `string` |
| `GZIP`                 | `string` |
| `JSON`                 | `string` |
| `JSON_CHARSET`         | `string` |
| `JSON_INSTALL_CHARSET` | `string` |
| `NONE_MATCH`           | `string` |
| `OCTET_STREAM`         | `string` |
| `TEXT_CHARSET`         | `string` |
| `TEXT_HTML`            | `string` |
| `TEXT_HTML_UTF8`       | `string` |
| `TEXT_PLAIN`           | `string` |
| `TEXT_PLAIN_UTF8`      | `string` |
| `USER_AGENT`           | `string` |
| `WWW_AUTH`             | `string` |
| `XSS`                  | `string` |

#### Defined in

[constants.ts:27](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/constants.ts#L27)

---

### HEADER_TYPE

• `Const` **HEADER_TYPE**: `Object`

#### Type declaration

| Name               | Type     |
| :----------------- | :------- |
| `ACCEPT_ENCODING`  | `string` |
| `AUTHORIZATION`    | `string` |
| `CONTENT_ENCODING` | `string` |
| `CONTENT_LENGTH`   | `string` |
| `CONTENT_TYPE`     | `string` |

#### Defined in

[constants.ts:11](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/constants.ts#L11)

---

### HTTP_STATUS

• `Const` **HTTP_STATUS**: `Object`

#### Type declaration

| Name                  | Type     |
| :-------------------- | :------- |
| `BAD_DATA`            | `number` |
| `BAD_REQUEST`         | `number` |
| `CANNOT_HANDLE`       | `number` |
| `CONFLICT`            | `number` |
| `CREATED`             | `number` |
| `FORBIDDEN`           | `number` |
| `INTERNAL_ERROR`      | `number` |
| `LOOP_DETECTED`       | `number` |
| `MULTIPLE_CHOICES`    | `number` |
| `NOT_FOUND`           | `number` |
| `NOT_IMPLEMENTED`     | `number` |
| `NOT_MODIFIED`        | `number` |
| `OK`                  | `number` |
| `SERVICE_UNAVAILABLE` | `number` |
| `UNAUTHORIZED`        | `number` |
| `UNSUPPORTED_MEDIA`   | `number` |

#### Defined in

[constants.ts:58](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/constants.ts#L58)

---

### LATEST

• `Const` **LATEST**: `"latest"`

#### Defined in

[constants.ts:7](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/constants.ts#L7)

---

### SUPPORT_ERRORS

• `Const` **SUPPORT_ERRORS**: `Object`

#### Type declaration

| Name                       | Type     |
| :------------------------- | :------- |
| `PARAMETERS_NOT_VALID`     | `string` |
| `PLUGIN_MISSING_INTERFACE` | `string` |
| `STORAGE_NOT_IMPLEMENT`    | `string` |
| `TFA_DISABLED`             | `string` |

#### Defined in

[error-utils.ts:44](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/error-utils.ts#L44)

---

### TOKEN_BASIC

• `Const` **TOKEN_BASIC**: `"Basic"`

#### Defined in

[constants.ts:24](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/constants.ts#L24)

---

### TOKEN_BEARER

• `Const` **TOKEN_BEARER**: `"Bearer"`

#### Defined in

[constants.ts:25](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/constants.ts#L25)

---

### USERS

• `Const` **USERS**: `"users"`

#### Defined in

[constants.ts:8](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/constants.ts#L8)

---

### validationUtils

• `Const` **validationUtils**: [`validatioUtils`](namespaces/validatioUtils.md) = `validatioUtils`

#### Defined in

[index.ts:28](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/index.ts#L28)
