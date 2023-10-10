---
id: 'fileUtils'
title: 'Namespace: fileUtils'
sidebar_label: 'fileUtils'
sidebar_position: 0
custom_edit_url: null
---

## Variables

### Files

• `Const` **Files**: `Object`

#### Type declaration

| Name           | Type     |
| :------------- | :------- |
| `DatabaseName` | `string` |

#### Defined in

[file-utils.ts:5](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/file-utils.ts#L5)

## Functions

### createTempFolder

▸ **createTempFolder**(`prefix`): `Promise`<`string`\>

Create a temporary folder.

#### Parameters

| Name     | Type     | Description                    |
| :------- | :------- | :----------------------------- |
| `prefix` | `string` | The prefix of the folder name. |

#### Returns

`Promise`<`string`\>

string

#### Defined in

[file-utils.ts:16](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/file-utils.ts#L16)

---

### createTempStorageFolder

▸ **createTempStorageFolder**(`prefix`, `folder?`): `Promise`<`string`\>

Create temporary folder for an asset.

#### Parameters

| Name     | Type     | Default value | Description |
| :------- | :------- | :------------ | :---------- |
| `prefix` | `string` | `undefined`   |             |
| `folder` | `string` | `'storage'`   | name        |

#### Returns

`Promise`<`string`\>

#### Defined in

[file-utils.ts:26](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/file-utils.ts#L26)
