---
id: 'modules'
title: '@verdaccio/config'
sidebar_label: 'Exports'
sidebar_position: 0.5
custom_edit_url: null
---

## Classes

- [Config](classes/Config.md)
- [ConfigBuilder](classes/ConfigBuilder.md)

## Interfaces

- [LegacyPackageList](interfaces/LegacyPackageList.md)

## Type Aliases

### SetupDirectory

Ƭ **SetupDirectory**: `Object`

#### Type declaration

| Name   | Type     |
| :----- | :------- |
| `path` | `string` |
| `type` | `string` |

#### Defined in

[config-path.ts:19](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config-path.ts#L19)

## Variables

### DEFAULT_REGISTRY

• `Const` **DEFAULT_REGISTRY**: `"https://registry.npmjs.org"`

#### Defined in

[uplinks.ts:7](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/uplinks.ts#L7)

---

### DEFAULT_UPLINK

• `Const` **DEFAULT_UPLINK**: `"npmjs"`

#### Defined in

[uplinks.ts:8](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/uplinks.ts#L8)

---

### PACKAGE_ACCESS

• `Const` **PACKAGE_ACCESS**: `Object`

#### Type declaration

| Name    | Type     |
| :------ | :------- |
| `ALL`   | `string` |
| `SCOPE` | `string` |

#### Defined in

[package-access.ts:23](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/package-access.ts#L23)

---

### ROLES

• `Const` **ROLES**: `Object`

#### Type declaration

| Name                   | Type     |
| :--------------------- | :------- |
| `$ALL`                 | `string` |
| `$ANONYMOUS`           | `string` |
| `$AUTH`                | `string` |
| `ALL`                  | `string` |
| `DEPRECATED_ALL`       | `string` |
| `DEPRECATED_ANONYMOUS` | `string` |
| `DEPRECATED_AUTH`      | `string` |

#### Defined in

[package-access.ts:12](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/package-access.ts#L12)

---

### TIME_EXPIRATION_1H

• `Const` **TIME_EXPIRATION_1H**: `"1h"`

#### Defined in

[security.ts:4](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/security.ts#L4)

---

### TOKEN_VALID_LENGTH

• `Const` **TOKEN_VALID_LENGTH**: `32`

#### Defined in

[token.ts:3](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/token.ts#L3)

---

### WEB_TITLE

• `Const` **WEB_TITLE**: `"Verdaccio"`

#### Defined in

[config.ts:31](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config.ts#L31)

---

### defaultLoggedUserRoles

• `Const` **defaultLoggedUserRoles**: `string`[]

All logged users will have by default the group $all and $authenticate

#### Defined in

[user.ts:8](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/user.ts#L8)

---

### defaultNonLoggedUserRoles

• `Const` **defaultNonLoggedUserRoles**: `string`[]

#### Defined in

[user.ts:18](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/user.ts#L18)

---

### defaultSecurity

• `Const` **defaultSecurity**: `Security`

#### Defined in

[security.ts:18](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/security.ts#L18)

---

### defaultUserRateLimiting

• `Const` **defaultUserRateLimiting**: `Object`

#### Type declaration

| Name       | Type     |
| :--------- | :------- |
| `max`      | `number` |
| `windowMs` | `number` |

#### Defined in

[config.ts:34](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config.ts#L34)

## Functions

### createAnonymousRemoteUser

▸ **createAnonymousRemoteUser**(): `RemoteUser`

Builds an anonymous remote user in case none is logged in.

#### Returns

`RemoteUser`

{ name: xx, groups: [], real_groups: [] }

#### Defined in

[user.ts:47](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/user.ts#L47)

---

### createRemoteUser

▸ **createRemoteUser**(`name`, `pluginGroups`): `RemoteUser`

Create a RemoteUser object

#### Parameters

| Name           | Type       |
| :------------- | :--------- |
| `name`         | `string`   |
| `pluginGroups` | `string`[] |

#### Returns

`RemoteUser`

{ name: xx, pluginGroups: [], real_groups: [] }

#### Defined in

[user.ts:30](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/user.ts#L30)

---

### findConfigFile

▸ **findConfigFile**(`configPath?`): `string`

Find and get the first config file that match.

#### Parameters

| Name          | Type     |
| :------------ | :------- |
| `configPath?` | `string` |

#### Returns

`string`

the config file path

#### Defined in

[config-path.ts:30](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config-path.ts#L30)

---

### fromJStoYAML

▸ **fromJStoYAML**(`config`): `string` \| `null`

#### Parameters

| Name     | Type                     |
| :------- | :----------------------- |
| `config` | `Partial`<`ConfigYaml`\> |

#### Returns

`string` \| `null`

#### Defined in

[parse.ts:56](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/parse.ts#L56)

---

### generateRandomSecretKey

▸ **generateRandomSecretKey**(): `string`

Secret key must have 32 characters.

#### Returns

`string`

#### Defined in

[token.ts:8](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/token.ts#L8)

---

### getDefaultConfig

▸ **getDefaultConfig**(`fileName?`): `ConfigYaml` & { `configPath`: `string` ; `config_path`: `string` }

#### Parameters

| Name       | Type     | Default value    |
| :--------- | :------- | :--------------- |
| `fileName` | `string` | `'default.yaml'` |

#### Returns

`ConfigYaml` & { `configPath`: `string` ; `config_path`: `string` }

#### Defined in

[conf/index.ts:5](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/conf/index.ts#L5)

---

### getUserAgent

▸ **getUserAgent**(`customUserAgent?`, `version?`, `name?`): `string`

#### Parameters

| Name               | Type                  |
| :----------------- | :-------------------- |
| `customUserAgent?` | `string` \| `boolean` |
| `version?`         | `string`              |
| `name?`            | `string`              |

#### Returns

`string`

#### Defined in

[agent.ts:3](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/agent.ts#L3)

---

### hasProxyTo

▸ **hasProxyTo**(`pkg`, `upLink`, `packages`): `boolean`

#### Parameters

| Name       | Type          |
| :--------- | :------------ |
| `pkg`      | `string`      |
| `upLink`   | `string`      |
| `packages` | `PackageList` |

#### Returns

`boolean`

#### Defined in

[uplinks.ts:51](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/uplinks.ts#L51)

---

### normalisePackageAccess

▸ **normalisePackageAccess**(`packages`): [`LegacyPackageList`](interfaces/LegacyPackageList.md)

#### Parameters

| Name       | Type                                                   |
| :--------- | :----------------------------------------------------- |
| `packages` | [`LegacyPackageList`](interfaces/LegacyPackageList.md) |

#### Returns

[`LegacyPackageList`](interfaces/LegacyPackageList.md)

#### Defined in

[package-access.ts:50](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/package-access.ts#L50)

---

### normalizeUserList

▸ **normalizeUserList**(`groupsList`): `any`

#### Parameters

| Name         | Type  |
| :----------- | :---- |
| `groupsList` | `any` |

#### Returns

`any`

#### Defined in

[package-access.ts:28](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/package-access.ts#L28)

---

### parseConfigFile

▸ **parseConfigFile**(`configPath`): `ConfigYaml` & { `configPath`: `string` ; `config_path`: `string` }

Parse a config file from yaml to JSON.

#### Parameters

| Name         | Type     | Description                                 |
| :----------- | :------- | :------------------------------------------ |
| `configPath` | `string` | the absolute path of the configuration file |

#### Returns

`ConfigYaml` & { `configPath`: `string` ; `config_path`: `string` }

#### Defined in

[parse.ts:17](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/parse.ts#L17)

---

### readDefaultConfig

▸ **readDefaultConfig**(): `Buffer`

#### Returns

`Buffer`

#### Defined in

[config-path.ts:66](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/config-path.ts#L66)

---

### sanityCheckNames

▸ **sanityCheckNames**(`item`, `users`): `any`

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `item`  | `string` |
| `users` | `any`    |

#### Returns

`any`

#### Defined in

[uplinks.ts:61](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/uplinks.ts#L61)

---

### sanityCheckUplinksProps

▸ **sanityCheckUplinksProps**(`configUpLinks`): `UpLinksConfList`

#### Parameters

| Name            | Type              |
| :-------------- | :---------------- |
| `configUpLinks` | `UpLinksConfList` |

#### Returns

`UpLinksConfList`

#### Defined in

[uplinks.ts:37](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/uplinks.ts#L37)

---

### uplinkSanityCheck

▸ **uplinkSanityCheck**(`uplinks`, `users?`): `UpLinksConfList`

#### Parameters

| Name      | Type              | Default value |
| :-------- | :---------------- | :------------ |
| `uplinks` | `UpLinksConfList` | `undefined`   |
| `users`   | `any`             | `BLACKLIST`   |

#### Returns

`UpLinksConfList`

#### Defined in

[uplinks.ts:18](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/uplinks.ts#L18)
