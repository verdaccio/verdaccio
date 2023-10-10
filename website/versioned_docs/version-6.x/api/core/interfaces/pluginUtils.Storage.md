---
id: 'pluginUtils.Storage'
title: 'Interface: Storage<PluginConfig>'
sidebar_label: 'pluginUtils.Storage'
custom_edit_url: null
---

[pluginUtils](../namespaces/pluginUtils.md).Storage

The base plugin class, set of utilities for developing
plugins.

## Type parameters

| Name           |
| :------------- |
| `PluginConfig` |

## Hierarchy

- [`Plugin`](../classes/pluginUtils.Plugin.md)<`PluginConfig`\>

  ↳ **`Storage`**

## Properties

### config

• `Readonly` **config**: `unknown`

#### Inherited from

[Plugin](../classes/pluginUtils.Plugin.md).[config](../classes/pluginUtils.Plugin.md#config)

#### Defined in

[plugin-utils.ts:36](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L36)

---

### options

• `Readonly` **options**: [`PluginOptions`](pluginUtils.PluginOptions.md)

#### Inherited from

[Plugin](../classes/pluginUtils.Plugin.md).[options](../classes/pluginUtils.Plugin.md#options)

#### Defined in

[plugin-utils.ts:37](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L37)

---

### version

• `Readonly` **version**: `number`

#### Inherited from

[Plugin](../classes/pluginUtils.Plugin.md).[version](../classes/pluginUtils.Plugin.md#version)

#### Defined in

[plugin-utils.ts:35](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L35)

## Methods

### add

▸ **add**(`name`): `Promise`<`void`\>

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[plugin-utils.ts:69](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L69)

---

### deleteToken

▸ **deleteToken**(`user`, `tokenKey`): `Promise`<`any`\>

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `user`     | `string` |
| `tokenKey` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[plugin-utils.ts:78](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L78)

---

### get

▸ **get**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[plugin-utils.ts:71](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L71)

---

### getPackageStorage

▸ **getPackageStorage**(`packageInfo`): [`StorageHandler`](pluginUtils.StorageHandler.md)

#### Parameters

| Name          | Type     |
| :------------ | :------- |
| `packageInfo` | `string` |

#### Returns

[`StorageHandler`](pluginUtils.StorageHandler.md)

#### Defined in

[plugin-utils.ts:75](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L75)

---

### getSecret

▸ **getSecret**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[plugin-utils.ts:73](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L73)

---

### getVersion

▸ **getVersion**(): `number`

#### Returns

`number`

#### Inherited from

[Plugin](../classes/pluginUtils.Plugin.md).[getVersion](../classes/pluginUtils.Plugin.md#getversion)

#### Defined in

[plugin-utils.ts:44](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L44)

---

### init

▸ **init**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[plugin-utils.ts:72](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L72)

---

### readTokens

▸ **readTokens**(`filter`): `Promise`<`Token`[]\>

#### Parameters

| Name     | Type          |
| :------- | :------------ |
| `filter` | `TokenFilter` |

#### Returns

`Promise`<`Token`[]\>

#### Defined in

[plugin-utils.ts:79](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L79)

---

### remove

▸ **remove**(`name`): `Promise`<`void`\>

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[plugin-utils.ts:70](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L70)

---

### saveToken

▸ **saveToken**(`token`): `Promise`<`any`\>

#### Parameters

| Name    | Type    |
| :------ | :------ |
| `token` | `Token` |

#### Returns

`Promise`<`any`\>

#### Defined in

[plugin-utils.ts:77](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L77)

---

### search

▸ **search**(`query`): `Promise`<[`SearchItem`](searchUtils.SearchItem.md)[]\>

#### Parameters

| Name    | Type                                                      |
| :------ | :-------------------------------------------------------- |
| `query` | [`SearchQuery`](../namespaces/searchUtils.md#searchquery) |

#### Returns

`Promise`<[`SearchItem`](searchUtils.SearchItem.md)[]\>

#### Defined in

[plugin-utils.ts:76](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L76)

---

### setSecret

▸ **setSecret**(`secret`): `Promise`<`any`\>

#### Parameters

| Name     | Type     |
| :------- | :------- |
| `secret` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[plugin-utils.ts:74](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L74)
