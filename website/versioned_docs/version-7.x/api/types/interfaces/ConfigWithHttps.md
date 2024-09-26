---
id: 'ConfigWithHttps'
title: 'Interface: ConfigWithHttps'
sidebar_label: 'ConfigWithHttps'
sidebar_position: 0
custom_edit_url: null
---

Configuration object with additional methods for configuration, includes yaml and internal medatada.

**`Interface`**

Config

## Hierarchy

- [`Config`](Config.md)

  ↳ **`ConfigWithHttps`**

## Properties

### \_debug

• `Optional` **\_debug**: `boolean`

#### Inherited from

[Config](Config.md).[\_debug](Config.md#_debug)

#### Defined in

[packages/core/types/src/configuration.ts:234](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L234)

---

### auth

• `Optional` **auth**: `any`

#### Inherited from

[Config](Config.md).[auth](Config.md#auth)

#### Defined in

[packages/core/types/src/configuration.ts:242](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L242)

---

### configPath

• **configPath**: `string`

#### Inherited from

[Config](Config.md).[configPath](Config.md#configpath)

#### Defined in

[packages/core/types/src/configuration.ts:279](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L279)

---

### experiments

• `Optional` **experiments**: [`FlagsConfig`](../modules.md#flagsconfig)

#### Inherited from

[Config](Config.md).[experiments](Config.md#experiments)

#### Defined in

[packages/core/types/src/configuration.ts:262](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L262)

---

### filters

• `Optional` **filters**: `any`

#### Inherited from

[Config](Config.md).[filters](Config.md#filters)

#### Defined in

[packages/core/types/src/configuration.ts:257](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L257)

---

### flags

• `Optional` **flags**: [`FlagsConfig`](../modules.md#flagsconfig)

#### Inherited from

[Config](Config.md).[flags](Config.md#flags)

#### Defined in

[packages/core/types/src/configuration.ts:260](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L260)

---

### http_proxy

• `Optional` **http_proxy**: `string`

#### Inherited from

[Config](Config.md).[http_proxy](Config.md#http_proxy)

#### Defined in

[packages/core/types/src/configuration.ts:249](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L249)

---

### https

• **https**: [`HttpsConf`](../modules.md#httpsconf)

#### Overrides

[Config](Config.md).[https](Config.md#https)

#### Defined in

[packages/core/types/src/configuration.ts:29](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L29)

---

### https_proxy

• `Optional` **https_proxy**: `string`

#### Inherited from

[Config](Config.md).[https_proxy](Config.md#https_proxy)

#### Defined in

[packages/core/types/src/configuration.ts:251](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L251)

---

### i18n

• `Optional` **i18n**: `Object`

#### Type declaration

| Name  | Type     |
| :---- | :------- |
| `web` | `string` |

#### Inherited from

[Config](Config.md).[i18n](Config.md#i18n)

#### Defined in

[packages/core/types/src/configuration.ts:267](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L267)

---

### listen

• `Optional` **listen**: [`ListenAddress`](ListenAddress.md)

#### Inherited from

[Config](Config.md).[listen](Config.md#listen)

#### Defined in

[packages/core/types/src/configuration.ts:246](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L246)

---

### log

• `Optional` **log**: [`LoggerConfItem`](LoggerConfItem.md)

#### Inherited from

[Config](Config.md).[log](Config.md#log)

#### Defined in

[packages/core/types/src/configuration.ts:238](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L238)

---

### logs

• `Optional` **logs**: [`LoggerConfItem`](LoggerConfItem.md)

#### Inherited from

[Config](Config.md).[logs](Config.md#logs)

#### Defined in

[packages/core/types/src/configuration.ts:240](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L240)

---

### max_body_size

• `Optional` **max_body_size**: `string`

#### Inherited from

[Config](Config.md).[max_body_size](Config.md#max_body_size)

#### Defined in

[packages/core/types/src/configuration.ts:253](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L253)

---

### middlewares

• `Optional` **middlewares**: `any`

#### Inherited from

[Config](Config.md).[middlewares](Config.md#middlewares)

#### Defined in

[packages/core/types/src/configuration.ts:256](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L256)

---

### no_proxy

• `Optional` **no_proxy**: `string`

#### Inherited from

[Config](Config.md).[no_proxy](Config.md#no_proxy)

#### Defined in

[packages/core/types/src/configuration.ts:252](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L252)

---

### notifications

• `Optional` **notifications**: [`Notifications`](Notifications.md)

#### Inherited from

[Config](Config.md).[notifications](Config.md#notifications)

#### Defined in

[packages/core/types/src/configuration.ts:254](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L254)

---

### notify

• `Optional` **notify**: [`Notifications`](Notifications.md) \| [`Notifications`](Notifications.md)[]

#### Inherited from

[Config](Config.md).[notify](Config.md#notify)

#### Defined in

[packages/core/types/src/configuration.ts:255](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L255)

---

### packages

• **packages**: [`PackageList`](PackageList.md)

#### Inherited from

[Config](Config.md).[packages](Config.md#packages)

#### Defined in

[packages/core/types/src/configuration.ts:283](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L283)

---

### plugins

• `Optional` **plugins**: `null` \| `string` \| `void`

#### Inherited from

[Config](Config.md).[plugins](Config.md#plugins)

#### Defined in

[packages/core/types/src/configuration.ts:250](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L250)

---

### publish

• `Optional` **publish**: [`PublishOptions`](PublishOptions.md)

#### Inherited from

[Config](Config.md).[publish](Config.md#publish)

#### Defined in

[packages/core/types/src/configuration.ts:244](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L244)

---

### secret

• **secret**: `string`

#### Inherited from

[Config](Config.md).[secret](Config.md#secret)

#### Defined in

[packages/core/types/src/configuration.ts:277](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L277)

---

### security

• **security**: [`Security`](Security.md)

#### Inherited from

[Config](Config.md).[security](Config.md#security)

#### Defined in

[packages/core/types/src/configuration.ts:285](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L285)

---

### self_path

• `Optional` **self_path**: `string`

#### Inherited from

[Config](Config.md).[self_path](Config.md#self_path)

#### Defined in

[packages/core/types/src/configuration.ts:281](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L281)

---

### server

• `Optional` **server**: [`ServerSettingsConf`](../modules.md#serversettingsconf)

#### Inherited from

[Config](Config.md).[server](Config.md#server)

#### Defined in

[packages/core/types/src/configuration.ts:259](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L259)

---

### server_id

• **server_id**: `string`

#### Inherited from

[Config](Config.md).[server_id](Config.md#server_id)

#### Defined in

[packages/core/types/src/configuration.ts:276](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L276)

---

### storage

• `Optional` **storage**: `string` \| `void`

#### Inherited from

[Config](Config.md).[storage](Config.md#storage)

#### Defined in

[packages/core/types/src/configuration.ts:235](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L235)

---

### store

• `Optional` **store**: `any`

#### Inherited from

[Config](Config.md).[store](Config.md#store)

#### Defined in

[packages/core/types/src/configuration.ts:245](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L245)

---

### uplinks

• **uplinks**: [`UpLinksConfList`](UpLinksConfList.md)

#### Inherited from

[Config](Config.md).[uplinks](Config.md#uplinks)

#### Defined in

[packages/core/types/src/configuration.ts:237](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L237)

---

### url_prefix

• `Optional` **url_prefix**: `string`

#### Inherited from

[Config](Config.md).[url_prefix](Config.md#url_prefix)

#### Defined in

[packages/core/types/src/configuration.ts:258](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L258)

---

### userRateLimit

• `Optional` **userRateLimit**: [`RateLimit`](../modules.md#ratelimit)

#### Inherited from

[Config](Config.md).[userRateLimit](Config.md#userratelimit)

#### Defined in

[packages/core/types/src/configuration.ts:263](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L263)

---

### user_agent

• `Optional` **user_agent**: `string`

#### Inherited from

[Config](Config.md).[user_agent](Config.md#user_agent)

#### Defined in

[packages/core/types/src/configuration.ts:248](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L248)

---

### web

• `Optional` **web**: [`WebConf`](../modules.md#webconf)

#### Inherited from

[Config](Config.md).[web](Config.md#web)

#### Defined in

[packages/core/types/src/configuration.ts:241](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L241)

## Methods

### checkSecretKey

▸ **checkSecretKey**(`token`): `string`

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `token` | `string` |

#### Returns

`string`

#### Inherited from

[Config](Config.md).[checkSecretKey](Config.md#checksecretkey)

#### Defined in

[packages/core/types/src/configuration.ts:287](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L287)

---

### getMatchedPackagesSpec

▸ **getMatchedPackagesSpec**(`storage`): `void` \| [`PackageAccess`](PackageAccess.md)

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `storage` | `string` |

#### Returns

`void` \| [`PackageAccess`](PackageAccess.md)

#### Inherited from

[Config](Config.md).[getMatchedPackagesSpec](Config.md#getmatchedpackagesspec)

#### Defined in

[packages/core/types/src/configuration.ts:288](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L288)
