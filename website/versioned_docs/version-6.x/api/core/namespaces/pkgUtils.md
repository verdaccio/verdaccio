---
id: 'pkgUtils'
title: 'Namespace: pkgUtils'
sidebar_label: 'pkgUtils'
sidebar_position: 0
custom_edit_url: null
---

## Functions

### extractTarballName

▸ **extractTarballName**(`tarball`): `any`

Extract the tarball name from a registry dist url
'https://registry.npmjs.org/test/-/test-0.0.2.tgz'

#### Parameters

| Name      | Type     | Description |
| :-------- | :------- | :---------- |
| `tarball` | `string` | tarball url |

#### Returns

`any`

tarball filename

#### Defined in

[pkg-utils.ts:14](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/pkg-utils.ts#L14)

---

### getLatest

▸ **getLatest**(`pkg`): `string`

Get the latest publihsed version of a package.

#### Parameters

| Name  | Type       |
| :---- | :--------- |
| `pkg` | `Manifest` |

#### Returns

`string`

#### Defined in

[pkg-utils.ts:40](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/pkg-utils.ts#L40)

---

### mergeVersions

▸ **mergeVersions**(`local`, `upstream`): `void`

Function gets a local info and an info from uplinks and tries to merge it
exported for unit tests only.

-

**`Deprecated`**

use @verdaccio/storage mergeVersions method

#### Parameters

| Name       | Type       | Description |
| :--------- | :--------- | :---------- |
| `local`    | `Manifest` | \*          |
| `upstream` | `Manifest` | \*          |

#### Returns

`void`

#### Defined in

[pkg-utils.ts:61](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/pkg-utils.ts#L61)

---

### semverSort

▸ **semverSort**(`listVersions`): `string`[]

Function filters out bad semver versions and sorts the array.

#### Parameters

| Name           | Type       |
| :------------- | :--------- |
| `listVersions` | `string`[] |

#### Returns

`string`[]

sorted Array

#### Defined in

[pkg-utils.ts:24](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/pkg-utils.ts#L24)
