---
id: 'searchUtils'
title: 'Namespace: searchUtils'
sidebar_label: 'searchUtils'
sidebar_position: 0
custom_edit_url: null
---

## Interfaces

- [SearchItem](../interfaces/searchUtils.SearchItem.md)
- [SearchPackageItem](../interfaces/searchUtils.SearchPackageItem.md)

## Type Aliases

### Score

Ƭ **Score**: `Object`

#### Type declaration

| Name     | Type                                            |
| :------- | :---------------------------------------------- |
| `detail` | [`SearchMetrics`](searchUtils.md#searchmetrics) |
| `final`  | `number`                                        |

#### Defined in

[search-utils.ts:33](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/search-utils.ts#L33)

---

### SearchItemPkg

Ƭ **SearchItemPkg**: `Object`

#### Type declaration

| Name      | Type               |
| :-------- | :----------------- |
| `name`    | `string`           |
| `path?`   | `string`           |
| `scoped?` | `string`           |
| `time?`   | `number` \| `Date` |

#### Defined in

[search-utils.ts:12](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/search-utils.ts#L12)

---

### SearchMetrics

Ƭ **SearchMetrics**: `Object`

#### Type declaration

| Name          | Type     |
| :------------ | :------- |
| `maintenance` | `number` |
| `popularity`  | `number` |
| `quality`     | `number` |

#### Defined in

[search-utils.ts:1](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/search-utils.ts#L1)

---

### SearchPackageBody

Ƭ **SearchPackageBody**: `Object`

#### Type declaration

| Name                | Type                                                                                      |
| :------------------ | :---------------------------------------------------------------------------------------- |
| `author`            | `string` \| `PublisherMaintainer`                                                         |
| `date`              | `string`                                                                                  |
| `description`       | `string`                                                                                  |
| `keywords`          | `string` \| `string`[] \| `undefined`                                                     |
| `links?`            | { `bugs?`: `string` ; `homepage?`: `string` ; `npm`: `string` ; `repository?`: `string` } |
| `links.bugs?`       | `string`                                                                                  |
| `links.homepage?`   | `string`                                                                                  |
| `links.npm`         | `string`                                                                                  |
| `links.repository?` | `string`                                                                                  |
| `maintainers?`      | `PublisherMaintainer`[]                                                                   |
| `name`              | `string`                                                                                  |
| `publisher?`        | `any`                                                                                     |
| `scope`             | `string`                                                                                  |
| `version`           | `string`                                                                                  |

#### Defined in

[search-utils.ts:51](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/search-utils.ts#L51)

---

### SearchQuery

Ƭ **SearchQuery**: { `from?`: `number` ; `size?`: `number` ; `text`: `string` } & [`SearchMetrics`](searchUtils.md#searchmetrics)

#### Defined in

[search-utils.ts:77](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/search-utils.ts#L77)

---

### SearchResults

Ƭ **SearchResults**: `Object`

#### Type declaration

| Name      | Type                                              |
| :-------- | :------------------------------------------------ |
| `objects` | [`SearchItemPkg`](searchUtils.md#searchitempkg)[] |
| `time`    | `string`                                          |
| `total`   | `number`                                          |

#### Defined in

[search-utils.ts:38](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/search-utils.ts#L38)

---

### UnStable

Ƭ **UnStable**: `Object`

#### Type declaration

| Name              | Type                       |
| :---------------- | :------------------------- |
| `flags?`          | { `unstable?`: `boolean` } |
| `flags.unstable?` | `boolean`                  |

#### Defined in

[search-utils.ts:6](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/search-utils.ts#L6)

## Variables

### UNSCOPED

• `Const` **UNSCOPED**: `"unscoped"`

#### Defined in

[search-utils.ts:75](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/search-utils.ts#L75)
