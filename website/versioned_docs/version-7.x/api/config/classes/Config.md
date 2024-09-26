---
id: 'Config'
title: 'Class: Config'
sidebar_label: 'Config'
sidebar_position: 0
custom_edit_url: null
---

Coordinates the application configuration

## Implements

- `Config`

## Constructors

### constructor

• **new Config**(`config`, `configOptions?`)

#### Parameters

| Name                                         | Type                                       | Default value |
| :------------------------------------------- | :----------------------------------------- | :------------ |
| `config`                                     | `ConfigYaml` & { `config_path`: `string` } | `undefined`   |
| `configOptions`                              | `Object`                                   | `undefined`   |
| `configOptions.forceEnhancedLegacySignature` | `boolean`                                  | `true`        |

#### Defined in

[config.ts:64](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config.ts#L64)

## Properties

### auth

• **auth**: `any`

#### Implementation of

AppConfig.auth

#### Defined in

[config.ts:47](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config.ts#L47)

---

### configOptions

• `Private` **configOptions**: `Object`

#### Type declaration

| Name                           | Type      |
| :----------------------------- | :-------- |
| `forceEnhancedLegacySignature` | `boolean` |

#### Defined in

[config.ts:63](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config.ts#L63)

---

### configPath

• **configPath**: `string`

#### Implementation of

AppConfig.configPath

#### Defined in

[config.ts:49](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config.ts#L49)

---

### flags

• **flags**: `FlagsConfig`

#### Implementation of

AppConfig.flags

#### Defined in

[config.ts:61](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config.ts#L61)

---

### packages

• **packages**: `PackageList`

#### Implementation of

AppConfig.packages

#### Defined in

[config.ts:45](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config.ts#L45)

---

### plugins

• **plugins**: `null` \| `string` \| `void`

#### Implementation of

AppConfig.plugins

#### Defined in

[config.ts:56](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config.ts#L56)

---

### secret

• **secret**: `string`

#### Implementation of

AppConfig.secret

#### Defined in

[config.ts:60](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config.ts#L60)

---

### security

• **security**: `Security`

#### Implementation of

AppConfig.security

#### Defined in

[config.ts:57](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config.ts#L57)

---

### self_path

• **self_path**: `string`

**`Deprecated`**

use configPath or config.getConfigPath();

#### Implementation of

AppConfig.self_path

#### Defined in

[config.ts:53](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config.ts#L53)

---

### serverSettings

• **serverSettings**: `ServerSettingsConf`

#### Defined in

[config.ts:58](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config.ts#L58)

---

### server_id

• **server_id**: `string`

#### Implementation of

AppConfig.server_id

#### Defined in

[config.ts:48](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config.ts#L48)

---

### storage

• **storage**: `string` \| `void`

#### Implementation of

AppConfig.storage

#### Defined in

[config.ts:54](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config.ts#L54)

---

### uplinks

• **uplinks**: `any`

#### Implementation of

AppConfig.uplinks

#### Defined in

[config.ts:44](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config.ts#L44)

---

### userRateLimit

• **userRateLimit**: `RateLimit`

#### Implementation of

AppConfig.userRateLimit

#### Defined in

[config.ts:62](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config.ts#L62)

---

### user_agent

• **user_agent**: `undefined` \| `string`

#### Implementation of

AppConfig.user_agent

#### Defined in

[config.ts:43](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config.ts#L43)

---

### users

• **users**: `any`

#### Defined in

[config.ts:46](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config.ts#L46)

## Methods

### checkSecretKey

▸ **checkSecretKey**(`secret?`): `string`

Store or create whether receive a secret key

**`Secret`**

external secret key

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `secret?` | `string` |

#### Returns

`string`

#### Implementation of

AppConfig.checkSecretKey

#### Defined in

[config.ts:150](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config.ts#L150)

---

### getConfigPath

▸ **getConfigPath**(): `string`

#### Returns

`string`

#### Defined in

[config.ts:134](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config.ts#L134)

---

### getMatchedPackagesSpec

▸ **getMatchedPackagesSpec**(`pkgName`): `void` \| `PackageAccess`

Check for package spec

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `pkgName` | `string` |

#### Returns

`void` \| `PackageAccess`

#### Implementation of

AppConfig.getMatchedPackagesSpec

#### Defined in

[config.ts:141](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config.ts#L141)
