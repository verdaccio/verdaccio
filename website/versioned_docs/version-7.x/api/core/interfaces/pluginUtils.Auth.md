---
id: 'pluginUtils.Auth'
title: 'Interface: Auth<T>'
sidebar_label: 'pluginUtils.Auth'
custom_edit_url: null
---

[pluginUtils](../namespaces/pluginUtils.md).Auth

The base plugin class, set of utilities for developing
plugins.

## Type parameters

| Name |
| :--- |
| `T`  |

## Hierarchy

- [`Plugin`](../classes/pluginUtils.Plugin.md)<`T`\>

  ↳ **`Auth`**

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

### adduser

▸ `Optional` **adduser**(`user`, `password`, `cb`): `void`

Handles the authenticated method.

```ts
 class Auth {
   public adduser(user: string, password: string, done: AuthCallback): void {
     if (!password) {
       return done(errorUtils.getUnauthorized(API_ERROR.BAD_USERNAME_PASSWORD));
     }
     // return boolean
     return done(null, true);
 }
```

#### Parameters

| Name       | Type                                                                |
| :--------- | :------------------------------------------------------------------ |
| `user`     | `string`                                                            |
| `password` | `string`                                                            |
| `cb`       | [`AuthUserCallback`](../namespaces/pluginUtils.md#authusercallback) |

#### Returns

`void`

#### Defined in

[plugin-utils.ts:144](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L144)

---

### allow_access

▸ `Optional` **allow_access**(`user`, `pkg`, `cb`): `void`

#### Parameters

| Name   | Type                                                            |
| :----- | :-------------------------------------------------------------- |
| `user` | `RemoteUser`                                                    |
| `pkg`  | `T` & `PackageAccess`                                           |
| `cb`   | [`AccessCallback`](../namespaces/pluginUtils.md#accesscallback) |

#### Returns

`void`

#### Defined in

[plugin-utils.ts:153](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L153)

▸ `Optional` **allow_access**(`user`, `pkg`, `cb`): `void`

#### Parameters

| Name   | Type                                                            |
| :----- | :-------------------------------------------------------------- |
| `user` | `RemoteUser`                                                    |
| `pkg`  | `AllowAccess` & `PackageAccess`                                 |
| `cb`   | [`AccessCallback`](../namespaces/pluginUtils.md#accesscallback) |

#### Returns

`void`

#### Defined in

[plugin-utils.ts:154](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L154)

---

### allow_publish

▸ `Optional` **allow_publish**(`user`, `pkg`, `cb`): `void`

#### Parameters

| Name   | Type                                                                    |
| :----- | :---------------------------------------------------------------------- |
| `user` | `RemoteUser`                                                            |
| `pkg`  | `T` & `PackageAccess`                                                   |
| `cb`   | [`AuthAccessCallback`](../namespaces/pluginUtils.md#authaccesscallback) |

#### Returns

`void`

#### Defined in

[plugin-utils.ts:151](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L151)

▸ `Optional` **allow_publish**(`user`, `pkg`, `cb`): `void`

#### Parameters

| Name   | Type                                                                    |
| :----- | :---------------------------------------------------------------------- |
| `user` | `RemoteUser`                                                            |
| `pkg`  | `AllowAccess` & `PackageAccess`                                         |
| `cb`   | [`AuthAccessCallback`](../namespaces/pluginUtils.md#authaccesscallback) |

#### Returns

`void`

#### Defined in

[plugin-utils.ts:152](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L152)

---

### allow_unpublish

▸ `Optional` **allow_unpublish**(`user`, `pkg`, `cb`): `void`

#### Parameters

| Name   | Type                                                                    |
| :----- | :---------------------------------------------------------------------- |
| `user` | `RemoteUser`                                                            |
| `pkg`  | `T` & `PackageAccess`                                                   |
| `cb`   | [`AuthAccessCallback`](../namespaces/pluginUtils.md#authaccesscallback) |

#### Returns

`void`

#### Defined in

[plugin-utils.ts:155](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L155)

▸ `Optional` **allow_unpublish**(`user`, `pkg`, `cb`): `void`

#### Parameters

| Name   | Type                                                                    |
| :----- | :---------------------------------------------------------------------- |
| `user` | `RemoteUser`                                                            |
| `pkg`  | `AllowAccess` & `PackageAccess`                                         |
| `cb`   | [`AuthAccessCallback`](../namespaces/pluginUtils.md#authaccesscallback) |

#### Returns

`void`

#### Defined in

[plugin-utils.ts:156](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L156)

---

### apiJWTmiddleware

▸ `Optional` **apiJWTmiddleware**(`helpers`): `RequestHandler`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>

#### Parameters

| Name      | Type  |
| :-------- | :---- |
| `helpers` | `any` |

#### Returns

`RequestHandler`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>

#### Defined in

[plugin-utils.ts:161](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L161)

---

### authenticate

▸ **authenticate**(`user`, `password`, `cb`): `void`

Handles the authenticated method.

```ts
 class Auth {
   public authenticate(user: string, password: string, done: AuthCallback): void {
     if (!password) {
       return done(errorUtils.getUnauthorized(API_ERROR.BAD_USERNAME_PASSWORD));
     }
     // always return an array of users
     return done(null, [user]);
 }
```

#### Parameters

| Name       | Type                                                        |
| :--------- | :---------------------------------------------------------- |
| `user`     | `string`                                                    |
| `password` | `string`                                                    |
| `cb`       | [`AuthCallback`](../namespaces/pluginUtils.md#authcallback) |

#### Returns

`void`

#### Defined in

[plugin-utils.ts:130](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L130)

---

### changePassword

▸ `Optional` **changePassword**(`user`, `password`, `newPassword`, `cb`): `void`

#### Parameters

| Name          | Type                                                                                    |
| :------------ | :-------------------------------------------------------------------------------------- |
| `user`        | `string`                                                                                |
| `password`    | `string`                                                                                |
| `newPassword` | `string`                                                                                |
| `cb`          | [`AuthChangePasswordCallback`](../namespaces/pluginUtils.md#authchangepasswordcallback) |

#### Returns

`void`

#### Defined in

[plugin-utils.ts:145](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L145)

---

### getVersion

▸ **getVersion**(): `number`

#### Returns

`number`

#### Inherited from

[Plugin](../classes/pluginUtils.Plugin.md).[getVersion](../classes/pluginUtils.Plugin.md#getversion)

#### Defined in

[plugin-utils.ts:44](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/plugin-utils.ts#L44)
