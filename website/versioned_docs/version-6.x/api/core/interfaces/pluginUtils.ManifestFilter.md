---
id: 'pluginUtils.ManifestFilter'
title: 'Interface: ManifestFilter<T>'
sidebar_label: 'pluginUtils.ManifestFilter'
custom_edit_url: null
---

[pluginUtils](../namespaces/pluginUtils.md).ManifestFilter

The base plugin class, set of utilities for developing
plugins.

## Type parameters

| Name |
| :--- |
| `T`  |

## Hierarchy

- [`Plugin`](../classes/pluginUtils.Plugin.md)<`T`\>

  ↳ **`ManifestFilter`**

## Properties

### config

• `Readonly` **config**: `unknown`

#### Inherited from

[Plugin](../classes/pluginUtils.Plugin.md).[config](../classes/pluginUtils.Plugin.md#config)

#### Defined in

[plugin-utils.ts:36](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L36)

---

### options

• `Readonly` **options**: [`PluginOptions`](pluginUtils.PluginOptions.md)

#### Inherited from

[Plugin](../classes/pluginUtils.Plugin.md).[options](../classes/pluginUtils.Plugin.md#options)

#### Defined in

[plugin-utils.ts:37](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L37)

---

### version

• `Readonly` **version**: `number`

#### Inherited from

[Plugin](../classes/pluginUtils.Plugin.md).[version](../classes/pluginUtils.Plugin.md#version)

#### Defined in

[plugin-utils.ts:35](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L35)

## Methods

### filter_metadata

▸ **filter_metadata**(`packageInfo`): `Promise`<`Manifest`\>

#### Parameters

| Name          | Type       |
| :------------ | :--------- |
| `packageInfo` | `Manifest` |

#### Returns

`Promise`<`Manifest`\>

#### Defined in

[plugin-utils.ts:173](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L173)

---

### getVersion

▸ **getVersion**(): `number`

#### Returns

`number`

#### Inherited from

[Plugin](../classes/pluginUtils.Plugin.md).[getVersion](../classes/pluginUtils.Plugin.md#getversion)

#### Defined in

[plugin-utils.ts:44](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L44)
