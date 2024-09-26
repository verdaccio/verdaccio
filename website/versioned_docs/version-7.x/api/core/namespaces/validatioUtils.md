---
id: 'validatioUtils'
title: 'Namespace: validatioUtils'
sidebar_label: 'validatioUtils'
sidebar_position: 0
custom_edit_url: null
---

## Functions

### isObject

▸ **isObject**(`obj`): `boolean`

Check whether an element is an Object

#### Parameters

| Name  | Type  | Description |
| :---- | :---- | :---------- |
| `obj` | `any` | the element |

#### Returns

`boolean`

#### Defined in

[validation-utils.ts:97](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/validation-utils.ts#L97)

---

### isPackageNameScoped

▸ **isPackageNameScoped**(`name`): `boolean`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |

#### Returns

`boolean`

#### Defined in

[validation-utils.ts:9](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/validation-utils.ts#L9)

---

### normalizeMetadata

▸ **normalizeMetadata**(`manifest`, `name`): `Manifest`

Validate the package metadata, add additional properties whether are missing within
the metadata properties.

#### Parameters

| Name       | Type       |
| :--------- | :--------- |
| `manifest` | `Manifest` |
| `name`     | `string`   |

#### Returns

`Manifest`

the object with additional properties as dist-tags ad versions
FUTURE: rename to normalizeMetadata

#### Defined in

[validation-utils.ts:72](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/validation-utils.ts#L72)

---

### validateName

▸ **validateName**(`name`): `boolean`

From normalize-package-data/lib/fixer.js

#### Parameters

| Name   | Type     | Description      |
| :----- | :------- | :--------------- |
| `name` | `string` | the package name |

#### Returns

`boolean`

whether is valid or not

#### Defined in

[validation-utils.ts:18](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/validation-utils.ts#L18)

---

### validatePackage

▸ **validatePackage**(`name`): `boolean`

Validate a package.

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |

#### Returns

`boolean`

whether the package is valid or not

#### Defined in

[validation-utils.ts:54](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/validation-utils.ts#L54)

---

### validatePassword

▸ **validatePassword**(`password`, `validation?`): `boolean`

#### Parameters

| Name         | Type     | Default value                 |
| :----------- | :------- | :---------------------------- |
| `password`   | `string` | `undefined`                   |
| `validation` | `RegExp` | `DEFAULT_PASSWORD_VALIDATION` |

#### Returns

`boolean`

#### Defined in

[validation-utils.ts:109](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/validation-utils.ts#L109)

---

### validatePublishSingleVersion

▸ **validatePublishSingleVersion**(`manifest`): `boolean`

Validate if a manifest has the correct structure when a new package
is being created. The properties name, versions and \_attachments must contain 1 element.

#### Parameters

| Name       | Type  |
| :--------- | :---- |
| `manifest` | `any` |

#### Returns

`boolean`

boolean

#### Defined in

[schemes/publish-manifest.ts:33](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/schemes/publish-manifest.ts#L33)
