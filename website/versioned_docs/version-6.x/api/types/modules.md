---
id: 'modules'
title: '@verdaccio/types - v12.0.0-next.0'
sidebar_label: 'Exports'
sidebar_position: 0.5
custom_edit_url: null
---

## Interfaces

- [APITokenOptions](interfaces/APITokenOptions.md)
- [AbbreviatedVersions](interfaces/AbbreviatedVersions.md)
- [AllowAccess](interfaces/AllowAccess.md)
- [AttachMents](interfaces/AttachMents.md)
- [AttachMentsItem](interfaces/AttachMentsItem.md)
- [AuthHtpasswd](interfaces/AuthHtpasswd.md)
- [AuthPackageAllow](interfaces/AuthPackageAllow.md)
- [Author](interfaces/Author.md)
- [Config](interfaces/Config.md)
- [ConfigWithHttps](interfaces/ConfigWithHttps.md)
- [ConfigYaml](interfaces/ConfigYaml.md)
- [Dependencies](interfaces/Dependencies.md)
- [Dist](interfaces/Dist.md)
- [DistFile](interfaces/DistFile.md)
- [DistFiles](interfaces/DistFiles.md)
- [Engines](interfaces/Engines.md)
- [FullRemoteManifest](interfaces/FullRemoteManifest.md)
- [GenericBody](interfaces/GenericBody.md)
- [Headers](interfaces/Headers.md)
- [HttpError](interfaces/HttpError.md)
- [HttpsConfKeyCert](interfaces/HttpsConfKeyCert.md)
- [HttpsConfPfx](interfaces/HttpsConfPfx.md)
- [ILocalStorage](interfaces/ILocalStorage.md)
- [ITokenActions](interfaces/ITokenActions.md)
- [JWTOptions](interfaces/JWTOptions.md)
- [JWTSignOptions](interfaces/JWTSignOptions.md)
- [JWTVerifyOptions](interfaces/JWTVerifyOptions.md)
- [ListenAddress](interfaces/ListenAddress.md)
- [Logger](interfaces/Logger.md)
- [LoggerConfItem](interfaces/LoggerConfItem.md)
- [Manifest](interfaces/Manifest.md)
- [MergeTags](interfaces/MergeTags.md)
- [Notifications](interfaces/Notifications.md)
- [Package](interfaces/Package.md)
- [PackageAccess](interfaces/PackageAccess.md)
- [PackageAccessYaml](interfaces/PackageAccessYaml.md)
- [PackageList](interfaces/PackageList.md)
- [PackageUsers](interfaces/PackageUsers.md)
- [PeerDependenciesMeta](interfaces/PeerDependenciesMeta.md)
- [PublishManifest](interfaces/PublishManifest.md)
- [PublishOptions](interfaces/PublishOptions.md)
- [RemoteUser](interfaces/RemoteUser.md)
- [Security](interfaces/Security.md)
- [Signatures](interfaces/Signatures.md)
- [Tags](interfaces/Tags.md)
- [Token](interfaces/Token.md)
- [TokenFilter](interfaces/TokenFilter.md)
- [UpLinkConf](interfaces/UpLinkConf.md)
- [UpLinkMetadata](interfaces/UpLinkMetadata.md)
- [UpLinkTokenConf](interfaces/UpLinkTokenConf.md)
- [UpLinks](interfaces/UpLinks.md)
- [UpLinksConfList](interfaces/UpLinksConfList.md)
- [Version](interfaces/Version.md)
- [Versions](interfaces/Versions.md)

## Type Aliases

### AbbreviatedManifest

Ƭ **AbbreviatedManifest**: `Pick`<[`Manifest`](interfaces/Manifest.md), `"name"` \| `"dist-tags"` \| `"time"`\> & { `modified`: `string` ; `versions`: [`AbbreviatedVersions`](interfaces/AbbreviatedVersions.md) }

#### Defined in

[packages/core/types/src/manifest.ts:242](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L242)

---

### AbbreviatedVersion

Ƭ **AbbreviatedVersion**: `Pick`<[`Version`](interfaces/Version.md), `"name"` \| `"version"` \| `"description"` \| `"dependencies"` \| `"devDependencies"` \| `"bin"` \| `"dist"` \| `"engines"` \| `"funding"` \| `"peerDependencies"`\>

#### Defined in

[packages/core/types/src/manifest.ts:222](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L222)

---

### AuthConf

Ƭ **AuthConf**: `any` \| [`AuthHtpasswd`](interfaces/AuthHtpasswd.md)

#### Defined in

[packages/core/types/src/configuration.ts:146](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L146)

---

### Callback

Ƭ **Callback**: `Function`

#### Defined in

[packages/core/types/src/commons.ts:2](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/commons.ts#L2)

---

### CallbackAction

Ƭ **CallbackAction**: (`err`: `any` \| `null`) => `void`

#### Type declaration

▸ (`err`): `void`

##### Parameters

| Name  | Type            |
| :---- | :-------------- |
| `err` | `any` \| `null` |

##### Returns

`void`

#### Defined in

[packages/core/types/src/commons.ts:4](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/commons.ts#L4)

---

### CallbackError

Ƭ **CallbackError**: (`err`: `NodeJS.ErrnoException`) => `void`

#### Type declaration

▸ (`err`): `void`

##### Parameters

| Name  | Type                    |
| :---- | :---------------------- |
| `err` | `NodeJS.ErrnoException` |

##### Returns

`void`

#### Defined in

[packages/core/types/src/commons.ts:6](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/commons.ts#L6)

---

### CommonWebConf

Ƭ **CommonWebConf**: `Object`

#### Type declaration

| Name                   | Type                                              |
| :--------------------- | :------------------------------------------------ |
| `darkMode?`            | `boolean`                                         |
| `favicon?`             | `string`                                          |
| `gravatar?`            | `boolean`                                         |
| `language?`            | `string`                                          |
| `login?`               | `boolean`                                         |
| `logo?`                | `string`                                          |
| `pkgManagers?`         | [`PackageManagers`](modules.md#packagemanagers)[] |
| `primaryColor`         | `string`                                          |
| `scope?`               | `string`                                          |
| `showDownloadTarball?` | `boolean`                                         |
| `showFooter?`          | `boolean`                                         |
| `showInfo?`            | `boolean`                                         |
| `showRaw?`             | `boolean`                                         |
| `showSearch?`          | `boolean`                                         |
| `showSettings?`        | `boolean`                                         |
| `showThemeSwitch?`     | `boolean`                                         |
| `sort_packages?`       | `string`                                          |
| `title?`               | `string`                                          |
| `url_prefix?`          | `string`                                          |

#### Defined in

[packages/core/types/src/configuration.ts:83](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L83)

---

### FlagsConfig

Ƭ **FlagsConfig**: `Object`

#### Type declaration

| Name              | Type      |
| :---------------- | :-------- |
| `changePassword?` | `boolean` |
| `searchRemote?`   | `boolean` |

#### Defined in

[packages/core/types/src/configuration.ts:75](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L75)

---

### HttpsConf

Ƭ **HttpsConf**: [`HttpsConfKeyCert`](interfaces/HttpsConfKeyCert.md) \| [`HttpsConfPfx`](interfaces/HttpsConfPfx.md)

#### Defined in

[packages/core/types/src/configuration.ts:201](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L201)

---

### LoggerConfigItem

Ƭ **LoggerConfigItem**: `Object`

#### Type declaration

| Name      | Type                                      |
| :-------- | :---------------------------------------- |
| `async?`  | `boolean`                                 |
| `colors?` | `boolean`                                 |
| `format?` | [`LoggerFormat`](modules.md#loggerformat) |
| `level?`  | `string`                                  |
| `path?`   | `string`                                  |
| `type?`   | [`LoggerType`](modules.md#loggertype)     |

#### Defined in

[packages/core/types/src/configuration.ts:19](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L19)

---

### LoggerFormat

Ƭ **LoggerFormat**: `"pretty"` \| `"pretty-timestamped"` \| `"json"`

#### Defined in

[packages/core/types/src/configuration.ts:16](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L16)

---

### LoggerLevel

Ƭ **LoggerLevel**: `"http"` \| `"fatal"` \| `"warn"` \| `"info"` \| `"debug"` \| `"trace"`

#### Defined in

[packages/core/types/src/configuration.ts:17](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L17)

---

### LoggerType

Ƭ **LoggerType**: `"stdout"` \| `"file"`

#### Defined in

[packages/core/types/src/configuration.ts:15](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L15)

---

### Notification

Ƭ **Notification**: [`Notifications`](interfaces/Notifications.md)

#### Defined in

[packages/core/types/src/configuration.ts:212](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L212)

---

### PackageManagers

Ƭ **PackageManagers**: `"pnpm"` \| `"yarn"` \| `"npm"`

#### Defined in

[packages/core/types/src/configuration.ts:80](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L80)

---

### PackageTransformer

Ƭ **PackageTransformer**: (`pkg`: [`Manifest`](interfaces/Manifest.md)) => [`Manifest`](interfaces/Manifest.md)

#### Type declaration

▸ (`pkg`): [`Manifest`](interfaces/Manifest.md)

##### Parameters

| Name  | Type                                 |
| :---- | :----------------------------------- |
| `pkg` | [`Manifest`](interfaces/Manifest.md) |

##### Returns

[`Manifest`](interfaces/Manifest.md)

#### Defined in

[packages/core/types/src/plugins/storage.ts:45](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/plugins/storage.ts#L45)

---

### PublisherMaintainer

Ƭ **PublisherMaintainer**: `Object`

#### Type declaration

| Name       | Type     |
| :--------- | :------- |
| `email`    | `string` |
| `username` | `string` |

#### Defined in

[packages/core/types/src/search.ts:1](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/search.ts#L1)

---

### RateLimit

Ƭ **RateLimit**: `Object`

#### Type declaration

| Name        | Type     |
| :---------- | :------- |
| `max?`      | `number` |
| `windowMs?` | `number` |

#### Defined in

[packages/core/types/src/configuration.ts:70](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L70)

---

### ReadPackageCallback

Ƭ **ReadPackageCallback**: (`err`: `any` \| `null`, `data?`: [`Manifest`](interfaces/Manifest.md)) => `void`

#### Type declaration

▸ (`err`, `data?`): `void`

##### Parameters

| Name    | Type                                 |
| :------ | :----------------------------------- |
| `err`   | `any` \| `null`                      |
| `data?` | [`Manifest`](interfaces/Manifest.md) |

##### Returns

`void`

#### Defined in

[packages/core/types/src/plugins/storage.ts:46](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/plugins/storage.ts#L46)

---

### SearchPackageBody

Ƭ **SearchPackageBody**: `Object`

#### Type declaration

| Name                | Type                                                                                      |
| :------------------ | :---------------------------------------------------------------------------------------- |
| `author`            | `string` \| [`PublisherMaintainer`](modules.md#publishermaintainer)                       |
| `date`              | `string`                                                                                  |
| `description`       | `string`                                                                                  |
| `keywords`          | `string` \| `string`[] \| `undefined`                                                     |
| `links?`            | { `bugs?`: `string` ; `homepage?`: `string` ; `npm`: `string` ; `repository?`: `string` } |
| `links.bugs?`       | `string`                                                                                  |
| `links.homepage?`   | `string`                                                                                  |
| `links.npm`         | `string`                                                                                  |
| `links.repository?` | `string`                                                                                  |
| `maintainers?`      | [`PublisherMaintainer`](modules.md#publishermaintainer)[]                                 |
| `name`              | `string`                                                                                  |
| `publisher?`        | `any`                                                                                     |
| `scope`             | `string`                                                                                  |
| `version`           | `string`                                                                                  |

#### Defined in

[packages/core/types/src/search.ts:6](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/search.ts#L6)

---

### SearchResultWeb

Ƭ **SearchResultWeb**: `Object`

#### Type declaration

| Name          | Type     |
| :------------ | :------- |
| `description` | `string` |
| `name`        | `string` |
| `version`     | `string` |

#### Defined in

[packages/core/types/src/search.ts:24](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/search.ts#L24)

---

### ServerSettingsConf

Ƭ **ServerSettingsConf**: `Object`

#### Type declaration

| Name                       | Type                                | Description                                                                                                                                                                                      |
| :------------------------- | :---------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `keepAliveTimeout?`        | `number`                            | -                                                                                                                                                                                                |
| `passwordValidationRegex?` | `RegExp`                            | -                                                                                                                                                                                                |
| `pluginPrefix?`            | `string`                            | Plugins should be prefixed verdaccio-XXXXXX by default. To override the default prefix, use this property without `-` If you set pluginPrefix: acme, the packages to resolve will be acme-XXXXXX |
| `rateLimit`                | [`RateLimit`](modules.md#ratelimit) | -                                                                                                                                                                                                |
| `trustProxy?`              | `string`                            | -                                                                                                                                                                                                |

#### Defined in

[packages/core/types/src/configuration.ts:214](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L214)

---

### StorageList

Ƭ **StorageList**: `string`[]

#### Defined in

[packages/core/types/src/plugins/storage.ts:4](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/plugins/storage.ts#L4)

---

### StorageUpdateCallback

Ƭ **StorageUpdateCallback**: (`data`: [`Manifest`](interfaces/Manifest.md), `cb`: [`CallbackAction`](modules.md#callbackaction)) => `void`

#### Type declaration

▸ (`data`, `cb`): `void`

##### Parameters

| Name   | Type                                          |
| :----- | :-------------------------------------------- |
| `data` | [`Manifest`](interfaces/Manifest.md)          |
| `cb`   | [`CallbackAction`](modules.md#callbackaction) |

##### Returns

`void`

#### Defined in

[packages/core/types/src/plugins/storage.ts:42](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/plugins/storage.ts#L42)

---

### StorageWriteCallback

Ƭ **StorageWriteCallback**: (`name`: `string`, `json`: [`Manifest`](interfaces/Manifest.md), `callback`: [`Callback`](modules.md#callback)) => `void`

#### Type declaration

▸ (`name`, `json`, `callback`): `void`

##### Parameters

| Name       | Type                                 |
| :--------- | :----------------------------------- |
| `name`     | `string`                             |
| `json`     | [`Manifest`](interfaces/Manifest.md) |
| `callback` | [`Callback`](modules.md#callback)    |

##### Returns

`void`

#### Defined in

[packages/core/types/src/plugins/storage.ts:44](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/plugins/storage.ts#L44)

---

### StringValue

Ƭ **StringValue**: `string` \| `void` \| `null`

#### Defined in

[packages/core/types/src/commons.ts:15](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/commons.ts#L15)

---

### TemplateUIOptions

Ƭ **TemplateUIOptions**: { `base`: `string` ; `basename?`: `string` ; `flags`: [`FlagsConfig`](modules.md#flagsconfig) ; `host?`: `string` ; `protocol?`: `string` ; `uri?`: `string` ; `version?`: `string` } & [`CommonWebConf`](modules.md#commonwebconf)

Options are passed to the index.html

#### Defined in

[packages/core/types/src/configuration.ts:108](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L108)

---

### TypeToken

Ƭ **TypeToken**: `"Bearer"` \| `"Basic"`

#### Defined in

[packages/core/types/src/configuration.ts:3](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L3)

---

### URLPrefix

Ƭ **URLPrefix**: `Object`

#### Type declaration

| Name       | Type      |
| :--------- | :-------- |
| `absolute` | `boolean` |
| `basePath` | `string`  |

#### Defined in

[packages/core/types/src/commons.ts:30](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/commons.ts#L30)

---

### WebConf

Ƭ **WebConf**: { `bodyAfter?`: `string`[] ; `bodyBefore?`: `string`[] ; `enable?`: `boolean` ; `html_cache?`: `boolean` ; `metaScripts?`: `string`[] ; `primaryColor?`: `string` ; `primary_color?`: `string` ; `rateLimit?`: [`RateLimit`](modules.md#ratelimit) ; `scriptsBodyAfter?`: `string`[] ; `scriptsHead?`: `string`[] ; `scriptsbodyBefore?`: `string`[] } & [`CommonWebConf`](modules.md#commonwebconf)

Options on config.yaml for web

#### Defined in

[packages/core/types/src/configuration.ts:122](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L122)

---

### onEndSearchPackage

Ƭ **onEndSearchPackage**: (`error?`: `any`) => `void`

#### Type declaration

▸ (`error?`): `void`

##### Parameters

| Name     | Type  |
| :------- | :---- |
| `error?` | `any` |

##### Returns

`void`

#### Defined in

[packages/core/types/src/plugins/storage.ts:39](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/plugins/storage.ts#L39)

---

### onSearchPackage

Ƭ **onSearchPackage**: (`item`: [`Manifest`](interfaces/Manifest.md), `cb`: [`CallbackAction`](modules.md#callbackaction)) => `void`

#### Type declaration

▸ (`item`, `cb`): `void`

This method expect return a Package object
eg:
{
name: string;
time: number;
... and other props
}

The `cb` callback object will be executed if:

- it might return object (truly)
- it might reutrn null

##### Parameters

| Name   | Type                                          |
| :----- | :-------------------------------------------- |
| `item` | [`Manifest`](interfaces/Manifest.md)          |
| `cb`   | [`CallbackAction`](modules.md#callbackaction) |

##### Returns

`void`

#### Defined in

[packages/core/types/src/plugins/storage.ts:36](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/plugins/storage.ts#L36)

---

### onValidatePackage

Ƭ **onValidatePackage**: (`name`: `string`) => `boolean`

#### Type declaration

▸ (`name`): `boolean`

##### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |

##### Returns

`boolean`

#### Defined in

[packages/core/types/src/plugins/storage.ts:40](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/plugins/storage.ts#L40)
