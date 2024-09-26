---
id: 'pluginUtils.StorageHandler'
title: 'Interface: StorageHandler'
sidebar_label: 'pluginUtils.StorageHandler'
custom_edit_url: null
---

[pluginUtils](../namespaces/pluginUtils.md).StorageHandler

## Properties

### logger

• **logger**: `Logger`

#### Defined in

[plugin-utils.ts:49](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L49)

## Methods

### createPackage

▸ **createPackage**(`name`, `manifest`): `Promise`<`void`\>

#### Parameters

| Name       | Type       |
| :--------- | :--------- |
| `name`     | `string`   |
| `manifest` | `Manifest` |

#### Returns

`Promise`<`void`\>

#### Defined in

[plugin-utils.ts:60](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L60)

---

### deletePackage

▸ **deletePackage**(`fileName`): `Promise`<`void`\>

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `fileName` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[plugin-utils.ts:50](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L50)

---

### hasPackage

▸ **hasPackage**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Defined in

[plugin-utils.ts:65](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L65)

---

### hasTarball

▸ **hasTarball**(`fileName`): `Promise`<`boolean`\>

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `fileName` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[plugin-utils.ts:63](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L63)

---

### readPackage

▸ **readPackage**(`name`): `Promise`<`Manifest`\>

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |

#### Returns

`Promise`<`Manifest`\>

#### Defined in

[plugin-utils.ts:57](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L57)

---

### readTarball

▸ **readTarball**(`pkgName`, `«destructured»`): `Promise`<`Readable`\>

#### Parameters

| Name             | Type          |
| :--------------- | :------------ |
| `pkgName`        | `string`      |
| `«destructured»` | `Object`      |
| › `signal`       | `AbortSignal` |

#### Returns

`Promise`<`Readable`\>

#### Defined in

[plugin-utils.ts:59](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L59)

---

### removePackage

▸ **removePackage**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[plugin-utils.ts:51](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L51)

---

### savePackage

▸ **savePackage**(`pkgName`, `value`): `Promise`<`void`\>

#### Parameters

| Name      | Type       |
| :-------- | :--------- |
| `pkgName` | `string`   |
| `value`   | `Manifest` |

#### Returns

`Promise`<`void`\>

#### Defined in

[plugin-utils.ts:58](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L58)

---

### updatePackage

▸ **updatePackage**(`packageName`, `handleUpdate`): `Promise`<`Manifest`\>

#### Parameters

| Name           | Type                                               |
| :------------- | :------------------------------------------------- |
| `packageName`  | `string`                                           |
| `handleUpdate` | (`manifest`: `Manifest`) => `Promise`<`Manifest`\> |

#### Returns

`Promise`<`Manifest`\>

#### Defined in

[plugin-utils.ts:53](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L53)

---

### writeTarball

▸ **writeTarball**(`tarballName`, `«destructured»`): `Promise`<`Writable`\>

#### Parameters

| Name             | Type          |
| :--------------- | :------------ |
| `tarballName`    | `string`      |
| `«destructured»` | `Object`      |
| › `signal`       | `AbortSignal` |

#### Returns

`Promise`<`Writable`\>

#### Defined in

[plugin-utils.ts:61](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L61)
