---
id: 'pluginUtils.IBasicAuth'
title: 'Interface: IBasicAuth'
sidebar_label: 'pluginUtils.IBasicAuth'
custom_edit_url: null
---

[pluginUtils](../namespaces/pluginUtils.md).IBasicAuth

## Methods

### add_user

▸ **add_user**(`user`, `password`, `cb`): `any`

#### Parameters

| Name       | Type       |
| :--------- | :--------- |
| `user`     | `string`   |
| `password` | `string`   |
| `cb`       | `Function` |

#### Returns

`any`

#### Defined in

[plugin-utils.ts:169](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L169)

---

### allow_access

▸ **allow_access**(`pkg`, `user`, `callback`): `void`

#### Parameters

| Name       | Type                                                    |
| :--------- | :------------------------------------------------------ |
| `pkg`      | [`AuthPluginPackage`](pluginUtils.AuthPluginPackage.md) |
| `user`     | `RemoteUser`                                            |
| `callback` | `Function`                                              |

#### Returns

`void`

#### Defined in

[plugin-utils.ts:168](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L168)

---

### authenticate

▸ **authenticate**(`user`, `password`, `cb`): `void`

#### Parameters

| Name       | Type       |
| :--------- | :--------- |
| `user`     | `string`   |
| `password` | `string`   |
| `cb`       | `Function` |

#### Returns

`void`

#### Defined in

[plugin-utils.ts:165](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L165)

---

### changePassword

▸ **changePassword**(`user`, `password`, `newPassword`, `cb`): `void`

#### Parameters

| Name          | Type       |
| :------------ | :--------- |
| `user`        | `string`   |
| `password`    | `string`   |
| `newPassword` | `string`   |
| `cb`          | `Function` |

#### Returns

`void`

#### Defined in

[plugin-utils.ts:167](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L167)

---

### invalidateToken

▸ `Optional` **invalidateToken**(`token`): `Promise`<`void`\>

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `token` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[plugin-utils.ts:166](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L166)
