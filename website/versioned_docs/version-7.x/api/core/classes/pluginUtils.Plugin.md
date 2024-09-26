---
id: 'pluginUtils.Plugin'
title: 'Class: Plugin<PluginConfig>'
sidebar_label: 'pluginUtils.Plugin'
custom_edit_url: null
---

[pluginUtils](../namespaces/pluginUtils.md).Plugin

The base plugin class, set of utilities for developing
plugins.

## Type parameters

| Name           |
| :------------- |
| `PluginConfig` |

## Hierarchy

- **`Plugin`**

  ↳ [`Storage`](../interfaces/pluginUtils.Storage.md)

  ↳ [`ExpressMiddleware`](../interfaces/pluginUtils.ExpressMiddleware.md)

  ↳ [`Auth`](../interfaces/pluginUtils.Auth.md)

  ↳ [`ManifestFilter`](../interfaces/pluginUtils.ManifestFilter.md)

## Constructors

### constructor

• **new Plugin**<`PluginConfig`\>(`config`, `options`)

#### Type parameters

| Name           |
| :------------- |
| `PluginConfig` |

#### Parameters

| Name      | Type                                                          |
| :-------- | :------------------------------------------------------------ |
| `config`  | `PluginConfig`                                                |
| `options` | [`PluginOptions`](../interfaces/pluginUtils.PluginOptions.md) |

#### Defined in

[plugin-utils.ts:38](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L38)

## Properties

### config

• `Readonly` **config**: `unknown`

#### Defined in

[plugin-utils.ts:36](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L36)

---

### options

• `Readonly` **options**: [`PluginOptions`](../interfaces/pluginUtils.PluginOptions.md)

#### Defined in

[plugin-utils.ts:37](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L37)

---

### version

• `Readonly` **version**: `number`

#### Defined in

[plugin-utils.ts:35](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L35)

---

### version

▪ `Static` **version**: `number` = `1`

#### Defined in

[plugin-utils.ts:34](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L34)

## Methods

### getVersion

▸ **getVersion**(): `number`

#### Returns

`number`

#### Defined in

[plugin-utils.ts:44](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L44)
