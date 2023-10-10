---
id: 'errorUtils'
title: 'Namespace: errorUtils'
sidebar_label: 'errorUtils'
sidebar_position: 0
custom_edit_url: null
---

## References

### API_ERROR

Re-exports [API_ERROR](../modules.md#api_error)

---

### APP_ERROR

Re-exports [APP_ERROR](../modules.md#app_error)

---

### SUPPORT_ERRORS

Re-exports [SUPPORT_ERRORS](../modules.md#support_errors)

---

### VerdaccioError

Re-exports [VerdaccioError](../modules.md#verdaccioerror)

## Functions

### getBadData

▸ **getBadData**(`customMessage?`): [`VerdaccioError`](../modules.md#verdaccioerror)

#### Parameters

| Name             | Type     |
| :--------------- | :------- |
| `customMessage?` | `string` |

#### Returns

[`VerdaccioError`](../modules.md#verdaccioerror)

#### Defined in

[error-utils.ts:71](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/error-utils.ts#L71)

---

### getBadRequest

▸ **getBadRequest**(`customMessage`): [`VerdaccioError`](../modules.md#verdaccioerror)

#### Parameters

| Name            | Type     |
| :-------------- | :------- |
| `customMessage` | `string` |

#### Returns

[`VerdaccioError`](../modules.md#verdaccioerror)

#### Defined in

[error-utils.ts:75](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/error-utils.ts#L75)

---

### getCode

▸ **getCode**(`statusCode`, `customMessage`): [`VerdaccioError`](../modules.md#verdaccioerror)

#### Parameters

| Name            | Type     |
| :-------------- | :------- |
| `statusCode`    | `number` |
| `customMessage` | `string` |

#### Returns

[`VerdaccioError`](../modules.md#verdaccioerror)

#### Defined in

[error-utils.ts:103](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/error-utils.ts#L103)

---

### getConflict

▸ **getConflict**(`message?`): [`VerdaccioError`](../modules.md#verdaccioerror)

#### Parameters

| Name      | Type     | Default value             |
| :-------- | :------- | :------------------------ |
| `message` | `string` | `API_ERROR.PACKAGE_EXIST` |

#### Returns

[`VerdaccioError`](../modules.md#verdaccioerror)

#### Defined in

[error-utils.ts:67](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/error-utils.ts#L67)

---

### getForbidden

▸ **getForbidden**(`message?`): [`VerdaccioError`](../modules.md#verdaccioerror)

#### Parameters

| Name      | Type     | Default value               |
| :-------- | :------- | :-------------------------- |
| `message` | `string` | `"can't use this filename"` |

#### Returns

[`VerdaccioError`](../modules.md#verdaccioerror)

#### Defined in

[error-utils.ts:89](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/error-utils.ts#L89)

---

### getInternalError

▸ **getInternalError**(`customMessage?`): [`VerdaccioError`](../modules.md#verdaccioerror)

#### Parameters

| Name             | Type     |
| :--------------- | :------- |
| `customMessage?` | `string` |

#### Returns

[`VerdaccioError`](../modules.md#verdaccioerror)

#### Defined in

[error-utils.ts:79](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/error-utils.ts#L79)

---

### getNotFound

▸ **getNotFound**(`customMessage?`): [`VerdaccioError`](../modules.md#verdaccioerror)

#### Parameters

| Name             | Type     |
| :--------------- | :------- |
| `customMessage?` | `string` |

#### Returns

[`VerdaccioError`](../modules.md#verdaccioerror)

#### Defined in

[error-utils.ts:99](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/error-utils.ts#L99)

---

### getServiceUnavailable

▸ **getServiceUnavailable**(`message?`): [`VerdaccioError`](../modules.md#verdaccioerror)

#### Parameters

| Name      | Type     | Default value                    |
| :-------- | :------- | :------------------------------- |
| `message` | `string` | `API_ERROR.RESOURCE_UNAVAILABLE` |

#### Returns

[`VerdaccioError`](../modules.md#verdaccioerror)

#### Defined in

[error-utils.ts:93](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/error-utils.ts#L93)

---

### getUnauthorized

▸ **getUnauthorized**(`message?`): [`VerdaccioError`](../modules.md#verdaccioerror)

#### Parameters

| Name      | Type     | Default value               |
| :-------- | :------- | :-------------------------- |
| `message` | `string` | `'no credentials provided'` |

#### Returns

[`VerdaccioError`](../modules.md#verdaccioerror)

#### Defined in

[error-utils.ts:85](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/core/core/src/error-utils.ts#L85)
