---
id: 'modules'
title: '@verdaccio/node-api'
sidebar_label: 'Exports'
sidebar_position: 0.5
custom_edit_url: null
---

## Functions

### initServer

▸ **initServer**(`config`, `port`, `version`, `pkgName`): `Promise`<`void`\>

Start the server on the port defined

#### Parameters

| Name      | Type               |
| :-------- | :----------------- |
| `config`  | `ConfigYaml`       |
| `port`    | `string` \| `void` |
| `version` | `string`           |
| `pkgName` | `string`           |

#### Returns

`Promise`<`void`\>

#### Defined in

[server.ts:103](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/node-api/src/server.ts#L103)

---

### runServer

▸ **runServer**(`config?`): `Promise`<`any`\>

Exposes a server factory to be instantiated programmatically.

```ts
const app = await runServer(); // default configuration
const app = await runServer('./config/config.yaml');
const app = await runServer({ configuration });
app.listen(4000, (event) => {
// do something
});
```

#### Parameters

| Name      | Type                     |
| :-------- | :----------------------- |
| `config?` | `string` \| `ConfigYaml` |

#### Returns

`Promise`<`any`\>

#### Defined in

[server.ts:186](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/node-api/src/server.ts#L186)
