---
id: 'Manifest'
title: 'Interface: Manifest'
sidebar_label: 'Manifest'
sidebar_position: 0
custom_edit_url: null
---

Represents upstream manifest from another registry

## Hierarchy

- [`FullRemoteManifest`](FullRemoteManifest.md)

- [`PublishManifest`](PublishManifest.md)

  ↳ **`Manifest`**

## Properties

### \_attachments

• **\_attachments**: [`AttachMents`](AttachMents.md)

The `_attachments` object has different usages:

- When a package is published, it contains the tarball as an string, this string is used to be
  converted as a tarball, usually attached to the package but not stored in the database.
- If user runs `npm star` the \_attachments will be at the manifest body but empty.

It has also an internal usage:

- Used as a cache for the tarball, quick access to the tarball shasum, etc. Instead
  iterate versions and find the right one, just using the tarball as a key which is what
  the package manager sends to the registry.

- A `_attachments` object is added every time a private tarball is published, upstream cached tarballs are
  not being part of this object, only for published private packages.

Note: This field is removed when the package is accesed through the web user interface.

#### Inherited from

[PublishManifest](PublishManifest.md).[\_attachments](PublishManifest.md#_attachments)

#### Defined in

[packages/core/types/src/manifest.ts:266](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L266)

---

### \_distfiles

• **\_distfiles**: [`DistFiles`](DistFiles.md)

store fast access to the dist url of an specific tarball, instead search version
by id, just the tarball id is faster.

The \_distfiles is created only when a package is being sync from an upstream.
also used to fetch tarballs from upstream, the private publish tarballs are not stored in
this object because they are not published in the upstream registry.

#### Defined in

[packages/core/types/src/manifest.ts:206](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L206)

---

### \_id

• `Optional` **\_id**: `string`

#### Inherited from

[FullRemoteManifest](FullRemoteManifest.md).[\_id](FullRemoteManifest.md#_id)

#### Defined in

[packages/core/types/src/manifest.ts:174](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L174)

---

### \_rev

• **\_rev**: `string`

store the revision of the manifest

#### Overrides

[FullRemoteManifest](FullRemoteManifest.md).[\_rev](FullRemoteManifest.md#_rev)

#### Defined in

[packages/core/types/src/manifest.ts:219](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L219)

---

### \_uplinks

• **\_uplinks**: [`UpLinks`](UpLinks.md)

Store access cache metadata, to avoid to fetch the same metadata multiple times.

The key represents the uplink id which is composed of a etag and a fetched timestamp.

The fetched timestamp is the time when the metadata was fetched, used to avoid to fetch the
same metadata until the metadata is older than the last fetch.

#### Defined in

[packages/core/types/src/manifest.ts:215](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L215)

---

### access

• `Optional` **access**: `any`

#### Inherited from

[FullRemoteManifest](FullRemoteManifest.md).[access](FullRemoteManifest.md#access)

#### Defined in

[packages/core/types/src/manifest.ts:187](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L187)

---

### author

• `Optional` **author**: `string` \| [`Author`](Author.md)

#### Inherited from

[FullRemoteManifest](FullRemoteManifest.md).[author](FullRemoteManifest.md#author)

#### Defined in

[packages/core/types/src/manifest.ts:193](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L193)

---

### bugs

• `Optional` **bugs**: `Object`

#### Type declaration

| Name  | Type     |
| :---- | :------- |
| `url` | `string` |

#### Inherited from

[FullRemoteManifest](FullRemoteManifest.md).[bugs](FullRemoteManifest.md#bugs)

#### Defined in

[packages/core/types/src/manifest.ts:188](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L188)

---

### description

• `Optional` **description**: `string`

#### Inherited from

[FullRemoteManifest](FullRemoteManifest.md).[description](FullRemoteManifest.md#description)

#### Defined in

[packages/core/types/src/manifest.ts:177](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L177)

---

### dist-tags

• **dist-tags**: [`GenericBody`](GenericBody.md)

#### Inherited from

[FullRemoteManifest](FullRemoteManifest.md).[dist-tags](FullRemoteManifest.md#dist-tags)

#### Defined in

[packages/core/types/src/manifest.ts:178](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L178)

---

### homepage

• `Optional` **homepage**: `string`

#### Inherited from

[FullRemoteManifest](FullRemoteManifest.md).[homepage](FullRemoteManifest.md#homepage)

#### Defined in

[packages/core/types/src/manifest.ts:190](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L190)

---

### keywords

• `Optional` **keywords**: `string`[]

#### Inherited from

[FullRemoteManifest](FullRemoteManifest.md).[keywords](FullRemoteManifest.md#keywords)

#### Defined in

[packages/core/types/src/manifest.ts:192](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L192)

---

### license

• `Optional` **license**: `string`

#### Inherited from

[FullRemoteManifest](FullRemoteManifest.md).[license](FullRemoteManifest.md#license)

#### Defined in

[packages/core/types/src/manifest.ts:189](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L189)

---

### maintainers

• `Optional` **maintainers**: [`Author`](Author.md)[]

#### Inherited from

[FullRemoteManifest](FullRemoteManifest.md).[maintainers](FullRemoteManifest.md#maintainers)

#### Defined in

[packages/core/types/src/manifest.ts:181](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L181)

---

### name

• **name**: `string`

#### Inherited from

[FullRemoteManifest](FullRemoteManifest.md).[name](FullRemoteManifest.md#name)

#### Defined in

[packages/core/types/src/manifest.ts:176](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L176)

---

### readme

• `Optional` **readme**: `string`

store the latest readme \*

#### Inherited from

[FullRemoteManifest](FullRemoteManifest.md).[readme](FullRemoteManifest.md#readme)

#### Defined in

[packages/core/types/src/manifest.ts:183](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L183)

---

### repository

• `Optional` **repository**: `string` \| { `directory?`: `string` ; `type?`: `string` ; `url`: `string` }

#### Inherited from

[FullRemoteManifest](FullRemoteManifest.md).[repository](FullRemoteManifest.md#repository)

#### Defined in

[packages/core/types/src/manifest.ts:191](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L191)

---

### time

• **time**: [`GenericBody`](GenericBody.md)

#### Inherited from

[FullRemoteManifest](FullRemoteManifest.md).[time](FullRemoteManifest.md#time)

#### Defined in

[packages/core/types/src/manifest.ts:179](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L179)

---

### users

• `Optional` **users**: [`PackageUsers`](PackageUsers.md)

store star assigned to this packages by users

#### Inherited from

[FullRemoteManifest](FullRemoteManifest.md).[users](FullRemoteManifest.md#users)

#### Defined in

[packages/core/types/src/manifest.ts:185](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L185)

---

### versions

• **versions**: [`Versions`](Versions.md)

#### Inherited from

[FullRemoteManifest](FullRemoteManifest.md).[versions](FullRemoteManifest.md#versions)

#### Defined in

[packages/core/types/src/manifest.ts:180](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L180)
