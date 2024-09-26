---
id: 'ConfigBuilder'
title: 'Class: ConfigBuilder'
sidebar_label: 'ConfigBuilder'
sidebar_position: 0
custom_edit_url: null
---

Helper configuration builder constructor, used to build the configuration for testing or
programatically creating a configuration.

## Constructors

### constructor

• **new ConfigBuilder**(`config?`)

#### Parameters

| Name      | Type                     |
| :-------- | :----------------------- |
| `config?` | `Partial`<`ConfigYaml`\> |

#### Defined in

[builder.ts:21](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/builder.ts#L21)

## Properties

### config

• `Private` **config**: `ConfigYaml`

#### Defined in

[builder.ts:19](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/builder.ts#L19)

## Methods

### addAuth

▸ **addAuth**(`auth`): [`ConfigBuilder`](ConfigBuilder.md)

#### Parameters

| Name   | Type              |
| :----- | :---------------- |
| `auth` | `Partial`<`any`\> |

#### Returns

[`ConfigBuilder`](ConfigBuilder.md)

#### Defined in

[builder.ts:46](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/builder.ts#L46)

---

### addLogger

▸ **addLogger**(`log`): [`ConfigBuilder`](ConfigBuilder.md)

#### Parameters

| Name  | Type             |
| :---- | :--------------- |
| `log` | `LoggerConfItem` |

#### Returns

[`ConfigBuilder`](ConfigBuilder.md)

#### Defined in

[builder.ts:51](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/builder.ts#L51)

---

### addPackageAccess

▸ **addPackageAccess**(`pattern`, `pkgAccess`): [`ConfigBuilder`](ConfigBuilder.md)

#### Parameters

| Name        | Type                |
| :---------- | :------------------ |
| `pattern`   | `string`            |
| `pkgAccess` | `PackageAccessYaml` |

#### Returns

[`ConfigBuilder`](ConfigBuilder.md)

#### Defined in

[builder.ts:30](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/builder.ts#L30)

---

### addSecurity

▸ **addSecurity**(`security`): [`ConfigBuilder`](ConfigBuilder.md)

#### Parameters

| Name       | Type                   |
| :--------- | :--------------------- |
| `security` | `Partial`<`Security`\> |

#### Returns

[`ConfigBuilder`](ConfigBuilder.md)

#### Defined in

[builder.ts:41](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/builder.ts#L41)

---

### addStorage

▸ **addStorage**(`storage`): [`ConfigBuilder`](ConfigBuilder.md)

#### Parameters

| Name      | Type                 |
| :-------- | :------------------- |
| `storage` | `string` \| `object` |

#### Returns

[`ConfigBuilder`](ConfigBuilder.md)

#### Defined in

[builder.ts:56](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/builder.ts#L56)

---

### addUplink

▸ **addUplink**(`id`, `uplink`): [`ConfigBuilder`](ConfigBuilder.md)

#### Parameters

| Name     | Type         |
| :------- | :----------- |
| `id`     | `string`     |
| `uplink` | `UpLinkConf` |

#### Returns

[`ConfigBuilder`](ConfigBuilder.md)

#### Defined in

[builder.ts:36](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/builder.ts#L36)

---

### getAsYaml

▸ **getAsYaml**(): `string`

#### Returns

`string`

#### Defined in

[builder.ts:69](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/builder.ts#L69)

---

### getConfig

▸ **getConfig**(): `ConfigYaml`

#### Returns

`ConfigYaml`

#### Defined in

[builder.ts:65](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/builder.ts#L65)

---

### build

▸ `Static` **build**(`config?`): [`ConfigBuilder`](ConfigBuilder.md)

#### Parameters

| Name      | Type                     |
| :-------- | :----------------------- |
| `config?` | `Partial`<`ConfigYaml`\> |

#### Returns

[`ConfigBuilder`](ConfigBuilder.md)

#### Defined in

[builder.ts:26](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/config/src/builder.ts#L26)
