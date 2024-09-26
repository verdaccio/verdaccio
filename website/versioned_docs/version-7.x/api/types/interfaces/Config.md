---
id: 'Config'
title: 'Interface: Config'
sidebar_label: 'Config'
sidebar_position: 0
custom_edit_url: null
---

Configuration object with additional methods for configuration, includes yaml and internal medatada.

**`Interface`**

Config

## Hierarchy

- `Omit`<[`ConfigYaml`](ConfigYaml.md), `"packages"` \| `"security"` \| `"configPath"`\>

  ↳ **`Config`**

  ↳↳ [`ConfigWithHttps`](ConfigWithHttps.md)

## Indexable

▪ [key: `string`]: `any`

## Properties

### \_debug

• `Optional` **\_debug**: `boolean`

#### Inherited from

Omit.\_debug

#### Defined in

[packages/core/types/src/configuration.ts:234](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L234)

---

### auth

• `Optional` **auth**: `any`

#### Inherited from

Omit.auth

#### Defined in

[packages/core/types/src/configuration.ts:242](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L242)

---

### configPath

• **configPath**: `string`

#### Defined in

[packages/core/types/src/configuration.ts:279](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L279)

---

### experiments

• `Optional` **experiments**: [`FlagsConfig`](../modules.md#flagsconfig)

#### Inherited from

Omit.experiments

#### Defined in

[packages/core/types/src/configuration.ts:262](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L262)

---

### filters

• `Optional` **filters**: `any`

#### Inherited from

Omit.filters

#### Defined in

[packages/core/types/src/configuration.ts:257](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L257)

---

### flags

• `Optional` **flags**: [`FlagsConfig`](../modules.md#flagsconfig)

#### Inherited from

Omit.flags

#### Defined in

[packages/core/types/src/configuration.ts:260](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L260)

---

### http_proxy

• `Optional` **http_proxy**: `string`

#### Inherited from

Omit.http_proxy

#### Defined in

[packages/core/types/src/configuration.ts:249](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L249)

---

### https

• `Optional` **https**: [`HttpsConf`](../modules.md#httpsconf)

#### Inherited from

Omit.https

#### Defined in

[packages/core/types/src/configuration.ts:247](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L247)

---

### https_proxy

• `Optional` **https_proxy**: `string`

#### Inherited from

Omit.https_proxy

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

Omit.i18n

#### Defined in

[packages/core/types/src/configuration.ts:267](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L267)

---

### listen

• `Optional` **listen**: [`ListenAddress`](ListenAddress.md)

#### Inherited from

Omit.listen

#### Defined in

[packages/core/types/src/configuration.ts:246](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L246)

---

### log

• `Optional` **log**: [`LoggerConfItem`](LoggerConfItem.md)

#### Inherited from

Omit.log

#### Defined in

[packages/core/types/src/configuration.ts:238](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L238)

---

### logs

• `Optional` **logs**: [`LoggerConfItem`](LoggerConfItem.md)

#### Inherited from

Omit.logs

#### Defined in

[packages/core/types/src/configuration.ts:240](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L240)

---

### max_body_size

• `Optional` **max_body_size**: `string`

#### Inherited from

Omit.max_body_size

#### Defined in

[packages/core/types/src/configuration.ts:253](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L253)

---

### middlewares

• `Optional` **middlewares**: `any`

#### Inherited from

Omit.middlewares

#### Defined in

[packages/core/types/src/configuration.ts:256](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L256)

---

### no_proxy

• `Optional` **no_proxy**: `string`

#### Inherited from

Omit.no_proxy

#### Defined in

[packages/core/types/src/configuration.ts:252](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L252)

---

### notifications

• `Optional` **notifications**: [`Notifications`](Notifications.md)

#### Inherited from

Omit.notifications

#### Defined in

[packages/core/types/src/configuration.ts:254](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L254)

---

### notify

• `Optional` **notify**: [`Notifications`](Notifications.md) \| [`Notifications`](Notifications.md)[]

#### Inherited from

Omit.notify

#### Defined in

[packages/core/types/src/configuration.ts:255](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L255)

---

### packages

• **packages**: [`PackageList`](PackageList.md)

#### Defined in

[packages/core/types/src/configuration.ts:283](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L283)

---

### plugins

• `Optional` **plugins**: `null` \| `string` \| `void`

#### Inherited from

Omit.plugins

#### Defined in

[packages/core/types/src/configuration.ts:250](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L250)

---

### publish

• `Optional` **publish**: [`PublishOptions`](PublishOptions.md)

#### Inherited from

Omit.publish

#### Defined in

[packages/core/types/src/configuration.ts:244](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L244)

---

### secret

• **secret**: `string`

#### Defined in

[packages/core/types/src/configuration.ts:277](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L277)

---

### security

• **security**: [`Security`](Security.md)

#### Defined in

[packages/core/types/src/configuration.ts:285](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L285)

---

### self_path

• `Optional` **self_path**: `string`

#### Defined in

[packages/core/types/src/configuration.ts:281](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L281)

---

### server

• `Optional` **server**: [`ServerSettingsConf`](../modules.md#serversettingsconf)

#### Inherited from

Omit.server

#### Defined in

[packages/core/types/src/configuration.ts:259](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L259)

---

### server_id

• **server_id**: `string`

#### Defined in

[packages/core/types/src/configuration.ts:276](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L276)

---

### storage

• `Optional` **storage**: `string` \| `void`

#### Inherited from

Omit.storage

#### Defined in

[packages/core/types/src/configuration.ts:235](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L235)

---

### store

• `Optional` **store**: `any`

#### Inherited from

Omit.store

#### Defined in

[packages/core/types/src/configuration.ts:245](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L245)

---

### uplinks

• **uplinks**: [`UpLinksConfList`](UpLinksConfList.md)

#### Inherited from

Omit.uplinks

#### Defined in

[packages/core/types/src/configuration.ts:237](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L237)

---

### url_prefix

• `Optional` **url_prefix**: `string`

#### Inherited from

Omit.url_prefix

#### Defined in

[packages/core/types/src/configuration.ts:258](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L258)

---

### userRateLimit

• `Optional` **userRateLimit**: [`RateLimit`](../modules.md#ratelimit)

#### Inherited from

Omit.userRateLimit

#### Defined in

[packages/core/types/src/configuration.ts:263](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L263)

---

### user_agent

• `Optional` **user_agent**: `string`

#### Inherited from

Omit.user_agent

#### Defined in

[packages/core/types/src/configuration.ts:248](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L248)

---

### web

• `Optional` **web**: [`WebConf`](../modules.md#webconf)

#### Inherited from

Omit.web

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

#### Defined in

[packages/core/types/src/configuration.ts:288](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L288)
