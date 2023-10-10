---
id: 'pluginUtils.ExpressMiddleware'
title: 'Interface: ExpressMiddleware<PluginConfig, Storage, Auth>'
sidebar_label: 'pluginUtils.ExpressMiddleware'
custom_edit_url: null
---

[pluginUtils](../namespaces/pluginUtils.md).ExpressMiddleware

This function allow add additional middleware to the application.

```ts
import express, { Request, Response } from 'express';

class Middleware extends Plugin {
  // instances of auth and storage are injected
  register_middlewares(app, auth, storage) {
    const router = express.Router();
    router.post('/my-endpoint', (req: Request, res: Response): void => {
      res.status(200).end();
    });
  }
}


const [plugin] = await asyncLoadPlugin(...);
plugin.register_middlewares(app, auth, storage);
```

## Type parameters

| Name           |
| :------------- |
| `PluginConfig` |
| `Storage`      |
| `Auth`         |

## Hierarchy

- [`Plugin`](../classes/pluginUtils.Plugin.md)<`PluginConfig`\>

  ↳ **`ExpressMiddleware`**

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

### getVersion

▸ **getVersion**(): `number`

#### Returns

`number`

#### Inherited from

[Plugin](../classes/pluginUtils.Plugin.md).[getVersion](../classes/pluginUtils.Plugin.md#getversion)

#### Defined in

[plugin-utils.ts:44](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L44)

---

### register_middlewares

▸ **register_middlewares**(`app`, `auth`, `storage`): `void`

#### Parameters

| Name      | Type      |
| :-------- | :-------- |
| `app`     | `Express` |
| `auth`    | `Auth`    |
| `storage` | `Storage` |

#### Returns

`void`

#### Defined in

[plugin-utils.ts:104](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L104)
