---
id: 'ConfigYaml'
title: 'Interface: ConfigYaml'
sidebar_label: 'ConfigYaml'
sidebar_position: 0
custom_edit_url: null
---

YAML configuration file available options.

## Properties

### \_debug

• `Optional` **\_debug**: `boolean`

#### Defined in

[packages/core/types/src/configuration.ts:234](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L234)

---

### auth

• `Optional` **auth**: `any`

#### Defined in

[packages/core/types/src/configuration.ts:242](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L242)

---

### configPath

• `Optional` **configPath**: `string`

#### Defined in

[packages/core/types/src/configuration.ts:266](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L266)

---

### experiments

• `Optional` **experiments**: [`FlagsConfig`](../modules.md#flagsconfig)

#### Defined in

[packages/core/types/src/configuration.ts:262](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L262)

---

### filters

• `Optional` **filters**: `any`

#### Defined in

[packages/core/types/src/configuration.ts:257](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L257)

---

### flags

• `Optional` **flags**: [`FlagsConfig`](../modules.md#flagsconfig)

#### Defined in

[packages/core/types/src/configuration.ts:260](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L260)

---

### http_proxy

• `Optional` **http_proxy**: `string`

#### Defined in

[packages/core/types/src/configuration.ts:249](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L249)

---

### https

• `Optional` **https**: [`HttpsConf`](../modules.md#httpsconf)

#### Defined in

[packages/core/types/src/configuration.ts:247](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L247)

---

### https_proxy

• `Optional` **https_proxy**: `string`

#### Defined in

[packages/core/types/src/configuration.ts:251](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L251)

---

### i18n

• `Optional` **i18n**: `Object`

#### Type declaration

| Name  | Type     |
| :---- | :------- |
| `web` | `string` |

#### Defined in

[packages/core/types/src/configuration.ts:267](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L267)

---

### listen

• `Optional` **listen**: [`ListenAddress`](ListenAddress.md)

#### Defined in

[packages/core/types/src/configuration.ts:246](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L246)

---

### log

• `Optional` **log**: [`LoggerConfItem`](LoggerConfItem.md)

#### Defined in

[packages/core/types/src/configuration.ts:238](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L238)

---

### logs

• `Optional` **logs**: [`LoggerConfItem`](LoggerConfItem.md)

#### Defined in

[packages/core/types/src/configuration.ts:240](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L240)

---

### max_body_size

• `Optional` **max_body_size**: `string`

#### Defined in

[packages/core/types/src/configuration.ts:253](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L253)

---

### middlewares

• `Optional` **middlewares**: `any`

#### Defined in

[packages/core/types/src/configuration.ts:256](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L256)

---

### no_proxy

• `Optional` **no_proxy**: `string`

#### Defined in

[packages/core/types/src/configuration.ts:252](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L252)

---

### notifications

• `Optional` **notifications**: [`Notifications`](Notifications.md)

#### Defined in

[packages/core/types/src/configuration.ts:254](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L254)

---

### notify

• `Optional` **notify**: [`Notifications`](Notifications.md) \| [`Notifications`](Notifications.md)[]

#### Defined in

[packages/core/types/src/configuration.ts:255](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L255)

---

### packages

• **packages**: [`PackageList`](PackageList.md)

#### Defined in

[packages/core/types/src/configuration.ts:236](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L236)

---

### plugins

• `Optional` **plugins**: `null` \| `string` \| `void`

#### Defined in

[packages/core/types/src/configuration.ts:250](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L250)

---

### publish

• `Optional` **publish**: [`PublishOptions`](PublishOptions.md)

#### Defined in

[packages/core/types/src/configuration.ts:244](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L244)

---

### security

• **security**: [`Security`](Security.md)

#### Defined in

[packages/core/types/src/configuration.ts:243](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L243)

---

### server

• `Optional` **server**: [`ServerSettingsConf`](../modules.md#serversettingsconf)

#### Defined in

[packages/core/types/src/configuration.ts:259](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L259)

---

### storage

• `Optional` **storage**: `string` \| `void`

#### Defined in

[packages/core/types/src/configuration.ts:235](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L235)

---

### store

• `Optional` **store**: `any`

#### Defined in

[packages/core/types/src/configuration.ts:245](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L245)

---

### uplinks

• **uplinks**: [`UpLinksConfList`](UpLinksConfList.md)

#### Defined in

[packages/core/types/src/configuration.ts:237](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L237)

---

### url_prefix

• `Optional` **url_prefix**: `string`

#### Defined in

[packages/core/types/src/configuration.ts:258](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L258)

---

### userRateLimit

• `Optional` **userRateLimit**: [`RateLimit`](../modules.md#ratelimit)

#### Defined in

[packages/core/types/src/configuration.ts:263](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L263)

---

### user_agent

• `Optional` **user_agent**: `string`

#### Defined in

[packages/core/types/src/configuration.ts:248](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L248)

---

### web

• `Optional` **web**: [`WebConf`](../modules.md#webconf)

#### Defined in

[packages/core/types/src/configuration.ts:241](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/configuration.ts#L241)
