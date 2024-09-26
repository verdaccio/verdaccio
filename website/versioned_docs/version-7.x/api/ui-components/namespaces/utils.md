---
id: 'utils'
title: 'Namespace: utils'
sidebar_label: 'utils'
sidebar_position: 0
custom_edit_url: null
---

## Interfaces

- [Repository](../interfaces/utils.Repository.md)

## Variables

### TIMEFORMAT

• `Const` **TIMEFORMAT**: `"L LTS"`

#### Defined in

[packages/ui-components/src/utils/utils.ts:11](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/utils/utils.ts#L11)

## Functions

### fileSizeSI

▸ **fileSizeSI**(`a`, `b?`, `c?`, `d?`, `e?`): `string`

#### Parameters

| Name | Type                        |
| :--- | :-------------------------- |
| `a`  | `number`                    |
| `b?` | `Math`                      |
| `c?` | (`p`: `number`) => `number` |
| `d?` | `number`                    |
| `e?` | `number`                    |

#### Returns

`string`

#### Defined in

[packages/ui-components/src/utils/utils.ts:108](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/utils/utils.ts#L108)

---

### formatDate

▸ **formatDate**(`lastUpdate`): `string`

#### Parameters

| Name         | Type                 |
| :----------- | :------------------- |
| `lastUpdate` | `string` \| `number` |

#### Returns

`string`

#### Defined in

[packages/ui-components/src/utils/utils.ts:58](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/utils/utils.ts#L58)

---

### formatDateDistance

▸ **formatDateDistance**(`lastUpdate`): `string`

#### Parameters

| Name         | Type                           |
| :----------- | :----------------------------- |
| `lastUpdate` | `string` \| `number` \| `Date` |

#### Returns

`string`

#### Defined in

[packages/ui-components/src/utils/utils.ts:62](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/utils/utils.ts#L62)

---

### formatLicense

▸ **formatLicense**(`license`): `string` \| `undefined`

Formats license field for webui.

**`See`**

https://docs.npmjs.com/files/package.json#license

#### Parameters

| Name      | Type  |
| :-------- | :---- |
| `license` | `any` |

#### Returns

`string` \| `undefined`

#### Defined in

[packages/ui-components/src/utils/utils.ts:22](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/utils/utils.ts#L22)

---

### formatRepository

▸ **formatRepository**(`repository`): `string` \| `null`

Formats repository field for webui.

**`See`**

https://docs.npmjs.com/files/package.json#repository

#### Parameters

| Name         | Type  |
| :----------- | :---- |
| `repository` | `any` |

#### Returns

`string` \| `null`

#### Defined in

[packages/ui-components/src/utils/utils.ts:46](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/utils/utils.ts#L46)

---

### getAuthorName

▸ **getAuthorName**(`authorName?`): `string`

#### Parameters

| Name          | Type     |
| :------------ | :------- |
| `authorName?` | `string` |

#### Returns

`string`

#### Defined in

[packages/ui-components/src/utils/utils.ts:96](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/utils/utils.ts#L96)

---

### getLastUpdatedPackageTime

▸ **getLastUpdatedPackageTime**(`uplinks?`): `string`

For <LastSync /> component

#### Parameters

| Name      | Type      |
| :-------- | :-------- |
| `uplinks` | `UpLinks` |

#### Returns

`string`

#### Defined in

[packages/ui-components/src/utils/utils.ts:70](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/utils/utils.ts#L70)

---

### getRecentReleases

▸ **getRecentReleases**(`time?`): `Time`[]

For <LastSync /> component

#### Parameters

| Name   | Type   |
| :----- | :----- |
| `time` | `Time` |

#### Returns

`Time`[]

last 3 releases

#### Defined in

[packages/ui-components/src/utils/utils.ts:87](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/utils/utils.ts#L87)
