---
id: 'ITokenActions'
title: 'Interface: ITokenActions'
sidebar_label: 'ITokenActions'
sidebar_position: 0
custom_edit_url: null
---

## Methods

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

[packages/core/types/src/plugins/storage.ts:19](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/plugins/storage.ts#L19)

---

### readTokens

▸ **readTokens**(`filter`): `Promise`<[`Token`](Token.md)[]\>

#### Parameters

| Name     | Type                            |
| :------- | :------------------------------ |
| `filter` | [`TokenFilter`](TokenFilter.md) |

#### Returns

`Promise`<[`Token`](Token.md)[]\>

#### Defined in

[packages/core/types/src/plugins/storage.ts:20](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/plugins/storage.ts#L20)

---

### saveToken

▸ **saveToken**(`token`): `Promise`<`any`\>

#### Parameters

| Name    | Type                |
| :------ | :------------------ |
| `token` | [`Token`](Token.md) |

#### Returns

`Promise`<`any`\>

#### Defined in

[packages/core/types/src/plugins/storage.ts:18](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/plugins/storage.ts#L18)
