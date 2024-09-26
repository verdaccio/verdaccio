---
id: 'PublishManifest'
title: 'Interface: PublishManifest'
sidebar_label: 'PublishManifest'
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- **`PublishManifest`**

  ↳ [`Manifest`](Manifest.md)

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

#### Defined in

[packages/core/types/src/manifest.ts:266](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/types/src/manifest.ts#L266)
