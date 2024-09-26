---
id: 'FullRemoteManifest'
title: 'Interface: FullRemoteManifest'
sidebar_label: 'FullRemoteManifest'
sidebar_position: 0
custom_edit_url: null
---

Represents upstream manifest from another registry

## Hierarchy

- **`FullRemoteManifest`**

  ↳ [`Manifest`](Manifest.md)

## Properties

### \_id

• `Optional` **\_id**: `string`

#### Defined in

[packages/core/types/src/manifest.ts:174](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L174)

---

### \_rev

• `Optional` **\_rev**: `string`

#### Defined in

[packages/core/types/src/manifest.ts:175](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L175)

---

### access

• `Optional` **access**: `any`

#### Defined in

[packages/core/types/src/manifest.ts:187](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L187)

---

### author

• `Optional` **author**: `string` \| [`Author`](Author.md)

#### Defined in

[packages/core/types/src/manifest.ts:193](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L193)

---

### bugs

• `Optional` **bugs**: `Object`

#### Type declaration

| Name  | Type     |
| :---- | :------- |
| `url` | `string` |

#### Defined in

[packages/core/types/src/manifest.ts:188](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L188)

---

### description

• `Optional` **description**: `string`

#### Defined in

[packages/core/types/src/manifest.ts:177](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L177)

---

### dist-tags

• **dist-tags**: [`GenericBody`](GenericBody.md)

#### Defined in

[packages/core/types/src/manifest.ts:178](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L178)

---

### homepage

• `Optional` **homepage**: `string`

#### Defined in

[packages/core/types/src/manifest.ts:190](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L190)

---

### keywords

• `Optional` **keywords**: `string`[]

#### Defined in

[packages/core/types/src/manifest.ts:192](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L192)

---

### license

• `Optional` **license**: `string`

#### Defined in

[packages/core/types/src/manifest.ts:189](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L189)

---

### maintainers

• `Optional` **maintainers**: [`Author`](Author.md)[]

#### Defined in

[packages/core/types/src/manifest.ts:181](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L181)

---

### name

• **name**: `string`

#### Defined in

[packages/core/types/src/manifest.ts:176](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L176)

---

### readme

• `Optional` **readme**: `string`

store the latest readme \*

#### Defined in

[packages/core/types/src/manifest.ts:183](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L183)

---

### repository

• `Optional` **repository**: `string` \| { `directory?`: `string` ; `type?`: `string` ; `url`: `string` }

#### Defined in

[packages/core/types/src/manifest.ts:191](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L191)

---

### time

• **time**: [`GenericBody`](GenericBody.md)

#### Defined in

[packages/core/types/src/manifest.ts:179](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L179)

---

### users

• `Optional` **users**: [`PackageUsers`](PackageUsers.md)

store star assigned to this packages by users

#### Defined in

[packages/core/types/src/manifest.ts:185](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L185)

---

### versions

• **versions**: [`Versions`](Versions.md)

#### Defined in

[packages/core/types/src/manifest.ts:180](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L180)
