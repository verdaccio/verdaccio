---
id: 'pluginUtils'
title: 'Namespace: pluginUtils'
sidebar_label: 'pluginUtils'
sidebar_position: 0
custom_edit_url: null
---

## Classes

- [Plugin](../classes/pluginUtils.Plugin.md)

## Interfaces

- [Auth](../interfaces/pluginUtils.Auth.md)
- [AuthPluginPackage](../interfaces/pluginUtils.AuthPluginPackage.md)
- [ExpressMiddleware](../interfaces/pluginUtils.ExpressMiddleware.md)
- [IBasicAuth](../interfaces/pluginUtils.IBasicAuth.md)
- [ManifestFilter](../interfaces/pluginUtils.ManifestFilter.md)
- [PluginOptions](../interfaces/pluginUtils.PluginOptions.md)
- [Storage](../interfaces/pluginUtils.Storage.md)
- [StorageHandler](../interfaces/pluginUtils.StorageHandler.md)

## Type Aliases

### AccessCallback

Ƭ **AccessCallback**: (`error`: [`VerdaccioError`](../modules.md#verdaccioerror) \| `null`, `ok?`: `boolean`) => `void`

#### Type declaration

▸ (`error`, `ok?`): `void`

##### Parameters

| Name    | Type                                                       |
| :------ | :--------------------------------------------------------- |
| `error` | [`VerdaccioError`](../modules.md#verdaccioerror) \| `null` |
| `ok?`   | `boolean`                                                  |

##### Returns

`void`

#### Defined in

[plugin-utils.ts:115](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L115)

---

### AuthAccessCallback

Ƭ **AuthAccessCallback**: (`error`: [`VerdaccioError`](../modules.md#verdaccioerror) \| `null`, `access?`: `boolean`) => `void`

#### Type declaration

▸ (`error`, `access?`): `void`

##### Parameters

| Name      | Type                                                       |
| :-------- | :--------------------------------------------------------- |
| `error`   | [`VerdaccioError`](../modules.md#verdaccioerror) \| `null` |
| `access?` | `boolean`                                                  |

##### Returns

`void`

#### Defined in

[plugin-utils.ts:112](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L112)

---

### AuthCallback

Ƭ **AuthCallback**: (`error`: [`VerdaccioError`](../modules.md#verdaccioerror) \| `null`, `groups?`: `string`[] \| `false`) => `void`

#### Type declaration

▸ (`error`, `groups?`): `void`

dasdsa

##### Parameters

| Name      | Type                                                       |
| :-------- | :--------------------------------------------------------- |
| `error`   | [`VerdaccioError`](../modules.md#verdaccioerror) \| `null` |
| `groups?` | `string`[] \| `false`                                      |

##### Returns

`void`

#### Defined in

[plugin-utils.ts:110](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L110)

---

### AuthChangePasswordCallback

Ƭ **AuthChangePasswordCallback**: (`error`: [`VerdaccioError`](../modules.md#verdaccioerror) \| `null`, `access?`: `boolean`) => `void`

#### Type declaration

▸ (`error`, `access?`): `void`

##### Parameters

| Name      | Type                                                       |
| :-------- | :--------------------------------------------------------- |
| `error`   | [`VerdaccioError`](../modules.md#verdaccioerror) \| `null` |
| `access?` | `boolean`                                                  |

##### Returns

`void`

#### Defined in

[plugin-utils.ts:114](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L114)

---

### AuthUserCallback

Ƭ **AuthUserCallback**: (`error`: [`VerdaccioError`](../modules.md#verdaccioerror) \| `null`, `access?`: `boolean` \| `string`) => `void`

#### Type declaration

▸ (`error`, `access?`): `void`

##### Parameters

| Name      | Type                                                       |
| :-------- | :--------------------------------------------------------- |
| `error`   | [`VerdaccioError`](../modules.md#verdaccioerror) \| `null` |
| `access?` | `boolean` \| `string`                                      |

##### Returns

`void`

#### Defined in

[plugin-utils.ts:113](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L113)
