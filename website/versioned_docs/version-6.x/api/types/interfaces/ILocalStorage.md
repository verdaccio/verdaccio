---
id: 'ILocalStorage'
title: 'Interface: ILocalStorage'
sidebar_label: 'ILocalStorage'
sidebar_position: 0
custom_edit_url: null
---

## Methods

### add

▸ **add**(`name`): `void`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |

#### Returns

`void`

#### Defined in

[packages/core/types/src/plugins/storage.ts:7](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/plugins/storage.ts#L7)

---

### get

▸ **get**(): [`StorageList`](../modules.md#storagelist)

#### Returns

[`StorageList`](../modules.md#storagelist)

#### Defined in

[packages/core/types/src/plugins/storage.ts:9](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/plugins/storage.ts#L9)

---

### remove

▸ **remove**(`name`): `void`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |

#### Returns

`void`

#### Defined in

[packages/core/types/src/plugins/storage.ts:8](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/plugins/storage.ts#L8)

---

### sync

▸ **sync**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/types/src/plugins/storage.ts:10](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/plugins/storage.ts#L10)
