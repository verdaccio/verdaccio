---
id: 'modules'
title: '@verdaccio/ui-components'
sidebar_label: 'Exports'
sidebar_position: 0.5
custom_edit_url: null
---

## Namespaces

- [Icons](namespaces/Icons.md)
- [colors](namespaces/colors.md)
- [url](namespaces/url.md)
- [utils](namespaces/utils.md)

## Enumerations

- [Route](enums/Route.md)

## Classes

- [ErrorBoundary](classes/ErrorBoundary.md)

## Component Functions

- [ActionBar](modules.md#actionbar)
- [AppConfigurationProvider](modules.md#appconfigurationprovider)
- [Author](modules.md#author)
- [CopyClipboard](modules.md#copyclipboard)
- [Dependencies](modules.md#dependencies)
- [Deprecated](modules.md#deprecated)
- [Detail](modules.md#detail)
- [Developers](modules.md#developers)
- [Distribution](modules.md#distribution)
- [Engines](modules.md#engines)
- [Footer](modules.md#footer)
- [FundButton](modules.md#fundbutton)
- [Header](modules.md#header)
- [HeaderInfoDialog](modules.md#headerinfodialog)
- [Heading](modules.md#heading)
- [Help](modules.md#help)
- [Home](modules.md#home)
- [Install](modules.md#install)
- [Label](modules.md#label)
- [Link](modules.md#link)
- [Loading](modules.md#loading)
- [LoginDialog](modules.md#logindialog)
- [Logo](modules.md#logo)
- [MenuItem](modules.md#menuitem)
- [NotFound](modules.md#notfound)
- [Package](modules.md#package)
- [PackageList](modules.md#packagelist)
- [PersistenceSettingProvider](modules.md#persistencesettingprovider)
- [RawViewer](modules.md#rawviewer)
- [Readme](modules.md#readme)
- [SideBar](modules.md#sidebar)
- [SideBarTitle](modules.md#sidebartitle)
- [StyleBaseline](modules.md#stylebaseline)
- [TextField](modules.md#textfield)
- [ThemeProvider](modules.md#themeprovider)
- [UpLinks](modules.md#uplinks)
- [VersionLayout](modules.md#versionlayout)
- [Versions](modules.md#versions)
- [copyToClipBoardUtility](modules.md#copytoclipboardutility)
- [getCLIChangePassword](modules.md#getclichangepassword)
- [getCLISBerryYamlRegistry](modules.md#getclisberryyamlregistry)
- [getCLISetConfigRegistry](modules.md#getclisetconfigregistry)
- [getCLISetRegistry](modules.md#getclisetregistry)
- [isTokenExpire](modules.md#istokenexpire)
- [useConfig](modules.md#useconfig)
- [useCustomTheme](modules.md#usecustomtheme)
- [useLanguage](modules.md#uselanguage)
- [useVersion](modules.md#useversion)

## Provider Functions

- [TranslatorProvider](modules.md#translatorprovider)
- [VersionProvider](modules.md#versionprovider)

## HOC Functions

- [loadable](modules.md#loadable)

## Hooks Functions

- [useLocalStorage](modules.md#uselocalstorage)
- [useOnClickOutside](modules.md#useonclickoutside)

## Type Aliases

### Dispatch

Ƭ **Dispatch**: `RematchDispatch`<`RootModel`\>

#### Defined in

[packages/ui-components/src/store/store.ts:14](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/store/store.ts#L14)

---

### FontWeight

Ƭ **FontWeight**: keyof typeof `fontWeight`

#### Defined in

[packages/ui-components/src/Theme/theme.ts:74](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/Theme/theme.ts#L74)

---

### LanguageItem

Ƭ **LanguageItem**: `Object`

#### Type declaration

| Name      | Type     |
| :-------- | :------- |
| `icon`    | `any`    |
| `lng`     | `string` |
| `menuKey` | `string` |

#### Defined in

[packages/ui-components/src/providers/TranslatorProvider/TranslatorProvider.tsx:13](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/providers/TranslatorProvider/TranslatorProvider.tsx#L13)

---

### LoginBody

Ƭ **LoginBody**: { `error?`: [`LoginError`](modules.md#loginerror) } & [`LoginResponse`](modules.md#loginresponse)

#### Defined in

[packages/ui-components/src/store/models/login.ts:23](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/store/models/login.ts#L23)

---

### LoginError

Ƭ **LoginError**: `Object`

#### Type declaration

| Name          | Type     |
| :------------ | :------- |
| `description` | `string` |
| `type`        | `string` |

#### Defined in

[packages/ui-components/src/store/models/login.ts:13](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/store/models/login.ts#L13)

---

### LoginResponse

Ƭ **LoginResponse**: `Object`

#### Type declaration

| Name       | Type               |
| :--------- | :----------------- |
| `token`    | `string` \| `null` |
| `username` | `string` \| `null` |

#### Defined in

[packages/ui-components/src/store/models/login.ts:18](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/store/models/login.ts#L18)

---

### RootState

Ƭ **RootState**: `RematchRootState`<`RootModel`, `FullModel`\>

#### Defined in

[packages/ui-components/src/store/store.ts:15](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/store/store.ts#L15)

---

### Theme

Ƭ **Theme**: `ReturnType`<typeof `getTheme`\>

#### Defined in

[packages/ui-components/src/Theme/theme.ts:121](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/Theme/theme.ts#L121)

## Variables

### Search

• **Search**: `ComponentClass`<`Pick`<`RouteComponentProps`<{}, `StaticContext`, `LocationState`\>, `never`\>, `any`\> & `WithRouterStatics`<`FC`<`RouteComponentProps`<{}, `StaticContext`, `LocationState`\>\>\>

#### Defined in

[packages/ui-components/src/components/Search/Search.tsx:162](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/components/Search/Search.tsx#L162)

---

### api

• **api**: `API`

#### Defined in

[packages/ui-components/src/store/api.ts:73](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/store/api.ts#L73)

---

### store

• `Const` **store**: `RematchStore`<`RootModel`, `FullModel`\>

#### Defined in

[packages/ui-components/src/store/store.ts:8](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/store/store.ts#L8)

## Component Functions

### ActionBar

▸ **ActionBar**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type    |
| :--------- | :------ |
| `props`    | `Props` |
| `context?` | `any`   |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### AppConfigurationProvider

▸ **AppConfigurationProvider**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name             | Type                                                                |
| :--------------- | :------------------------------------------------------------------ |
| `props`          | `Object`                                                            |
| `props.children` | `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\> |
| `context?`       | `any`                                                               |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### Author

▸ **Author**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name                | Type     |
| :------------------ | :------- |
| `props`             | `Object` |
| `props.packageMeta` | `any`    |
| `context?`          | `any`    |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### CopyClipboard

▸ **CopyClipboard**(`«destructured»`): `Element`

#### Parameters

| Name             | Type    |
| :--------------- | :------ |
| `«destructured»` | `Props` |

#### Returns

`Element`

#### Defined in

[packages/ui-components/src/components/CopyClipboard/CopyToClipBoard.tsx:31](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/components/CopyClipboard/CopyToClipBoard.tsx#L31)

---

### Dependencies

▸ **Dependencies**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name                | Type     |
| :------------------ | :------- |
| `props`             | `Object` |
| `props.packageMeta` | `any`    |
| `context?`          | `any`    |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### Deprecated

▸ **Deprecated**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type    |
| :--------- | :------ |
| `props`    | `Props` |
| `context?` | `any`   |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### Detail

▸ **Detail**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `props`    | `Object` |
| `context?` | `any`    |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### Developers

▸ **Developers**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type    |
| :--------- | :------ |
| `props`    | `Props` |
| `context?` | `any`   |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### Distribution

▸ **Distribution**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name                | Type                   |
| :------------------ | :--------------------- |
| `props`             | `Object`               |
| `props.packageMeta` | `PackageMetaInterface` |
| `context?`          | `any`                  |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### Engines

▸ **Engines**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type    |
| :--------- | :------ |
| `props`    | `Props` |
| `context?` | `any`   |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### Footer

▸ **Footer**(): `Element`

#### Returns

`Element`

#### Defined in

[packages/ui-components/src/sections/Footer/Footer.tsx:18](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/sections/Footer/Footer.tsx#L18)

---

### FundButton

▸ **FundButton**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name                | Type     |
| :------------------ | :------- |
| `props`             | `Object` |
| `props.packageMeta` | `any`    |
| `context?`          | `any`    |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### Header

▸ **Header**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type    |
| :--------- | :------ |
| `props`    | `Props` |
| `context?` | `any`   |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### HeaderInfoDialog

▸ **HeaderInfoDialog**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type    |
| :--------- | :------ |
| `props`    | `Props` |
| `context?` | `any`   |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### Heading

▸ **Heading**(`props`): `null` \| `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\>

**NOTE**: Exotic components are not callable.

#### Parameters

| Name    | Type                                                                     |
| :------ | :----------------------------------------------------------------------- |
| `props` | `Pick`<`Props`, keyof `Props`\> & `RefAttributes`<`HTMLHeadingElement`\> |

#### Returns

`null` \| `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\>

#### Defined in

node_modules/@types/react/index.d.ts:351

---

### Help

▸ **Help**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `props`    | `Object` |
| `context?` | `any`    |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### Home

▸ **Home**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `props`    | `Object` |
| `context?` | `any`    |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### Install

▸ **Install**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type    |
| :--------- | :------ |
| `props`    | `Props` |
| `context?` | `any`   |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### Label

▸ **Label**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type    |
| :--------- | :------ |
| `props`    | `Props` |
| `context?` | `any`   |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### Link

▸ **Link**(`props`): `null` \| `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\>

**NOTE**: Exotic components are not callable.

#### Parameters

| Name    | Type                                                                                     |
| :------ | :--------------------------------------------------------------------------------------- |
| `props` | `Pick`<`any`, `string` \| `number` \| `symbol`\> & `RefAttributes`<`HTMLAnchorElement`\> |

#### Returns

`null` \| `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\>

#### Defined in

node_modules/@types/react/index.d.ts:351

---

### Loading

▸ **Loading**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `props`    | `Object` |
| `context?` | `any`    |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### LoginDialog

▸ **LoginDialog**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type    |
| :--------- | :------ |
| `props`    | `Props` |
| `context?` | `any`   |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### Logo

▸ **Logo**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type    |
| :--------- | :------ |
| `props`    | `Props` |
| `context?` | `any`   |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### MenuItem

▸ **MenuItem**(`props`): `null` \| `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\>

**NOTE**: Exotic components are not callable.

#### Parameters

| Name    | Type                                                              |
| :------ | :---------------------------------------------------------------- |
| `props` | `Pick`<`Props`, keyof `Props`\> & `RefAttributes`<`MenuItemRef`\> |

#### Returns

`null` \| `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\>

#### Defined in

node_modules/@types/react/index.d.ts:351

---

### NotFound

▸ **NotFound**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `props`    | `Object` |
| `context?` | `any`    |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### Package

▸ **Package**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type               |
| :--------- | :----------------- |
| `props`    | `PackageInterface` |
| `context?` | `any`              |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### PackageList

▸ **PackageList**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type    |
| :--------- | :------ |
| `props`    | `Props` |
| `context?` | `any`   |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### PersistenceSettingProvider

▸ **PersistenceSettingProvider**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name             | Type                                                                |
| :--------------- | :------------------------------------------------------------------ |
| `props`          | `Object`                                                            |
| `props.children` | `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\> |
| `context?`       | `any`                                                               |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### RawViewer

▸ **RawViewer**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type    |
| :--------- | :------ |
| `props`    | `Props` |
| `context?` | `any`   |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### Readme

▸ **Readme**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type    |
| :--------- | :------ |
| `props`    | `Props` |
| `context?` | `any`   |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### SideBar

▸ **SideBar**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `props`    | `Object` |
| `context?` | `any`    |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### SideBarTitle

▸ **SideBarTitle**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type    |
| :--------- | :------ |
| `props`    | `Props` |
| `context?` | `any`   |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### StyleBaseline

▸ **StyleBaseline**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `props`    | `Object` |
| `context?` | `any`    |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### TextField

▸ **TextField**(`props`): `null` \| `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\>

**NOTE**: Exotic components are not callable.

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `props` | `Object` |

#### Returns

`null` \| `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\>

#### Defined in

node_modules/@types/react/index.d.ts:351

---

### ThemeProvider

▸ **ThemeProvider**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name             | Type     |
| :--------------- | :------- |
| `props`          | `Object` |
| `props.children` | `any`    |
| `context?`       | `any`    |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### UpLinks

▸ **UpLinks**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name                | Type     |
| :------------------ | :------- |
| `props`             | `Object` |
| `props.packageMeta` | `any`    |
| `context?`          | `any`    |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### VersionLayout

▸ **VersionLayout**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `props`    | `Object` |
| `context?` | `any`    |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### Versions

▸ **Versions**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

#### Parameters

| Name       | Type    |
| :--------- | :------ |
| `props`    | `Props` |
| `context?` | `any`   |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### copyToClipBoardUtility

▸ **copyToClipBoardUtility**(`str`): (`e`: `SyntheticEvent`<`HTMLElement`, `Event`\>) => `void`

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `str` | `string` |

#### Returns

`fn`

▸ (`e`): `void`

##### Parameters

| Name | Type                                      |
| :--- | :---------------------------------------- |
| `e`  | `SyntheticEvent`<`HTMLElement`, `Event`\> |

##### Returns

`void`

#### Defined in

[packages/ui-components/src/components/CopyClipboard/utils.ts:4](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/components/CopyClipboard/utils.ts#L4)

---

### getCLIChangePassword

▸ **getCLIChangePassword**(`command`, `registryUrl`): `string`

#### Parameters

| Name          | Type     |
| :------------ | :------- |
| `command`     | `string` |
| `registryUrl` | `string` |

#### Returns

`string`

#### Defined in

[packages/ui-components/src/utils/cli-utils.ts:36](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/utils/cli-utils.ts#L36)

---

### getCLISBerryYamlRegistry

▸ **getCLISBerryYamlRegistry**(`scope`, `registryUrl`): `string`

#### Parameters

| Name          | Type                    |
| :------------ | :---------------------- |
| `scope`       | `undefined` \| `string` |
| `registryUrl` | `string`                |

#### Returns

`string`

#### Defined in

[packages/ui-components/src/utils/cli-utils.ts:40](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/utils/cli-utils.ts#L40)

---

### getCLISetConfigRegistry

▸ **getCLISetConfigRegistry**(`command`, `scope`, `registryUrl`): `string`

#### Parameters

| Name          | Type                    |
| :------------ | :---------------------- |
| `command`     | `string`                |
| `scope`       | `undefined` \| `string` |
| `registryUrl` | `string`                |

#### Returns

`string`

#### Defined in

[packages/ui-components/src/utils/cli-utils.ts:23](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/utils/cli-utils.ts#L23)

---

### getCLISetRegistry

▸ **getCLISetRegistry**(`command`, `registryUrl`): `string`

#### Parameters

| Name          | Type     |
| :------------ | :------- |
| `command`     | `string` |
| `registryUrl` | `string` |

#### Returns

`string`

#### Defined in

[packages/ui-components/src/utils/cli-utils.ts:32](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/utils/cli-utils.ts#L32)

---

### isTokenExpire

▸ **isTokenExpire**(`token`): `boolean`

#### Parameters

| Name    | Type               |
| :------ | :----------------- |
| `token` | `null` \| `string` |

#### Returns

`boolean`

#### Defined in

[packages/ui-components/src/utils/token.ts:5](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/utils/token.ts#L5)

---

### useConfig

▸ **useConfig**(): `ConfigProviderProps`

#### Returns

`ConfigProviderProps`

#### Defined in

[packages/ui-components/src/providers/AppConfigurationProvider/AppConfigurationProvider.tsx:73](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/providers/AppConfigurationProvider/AppConfigurationProvider.tsx#L73)

---

### useCustomTheme

▸ **useCustomTheme**(): `undefined` \| `Props`

#### Returns

`undefined` \| `Props`

#### Defined in

[packages/ui-components/src/Theme/ThemeProvider.tsx:42](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/Theme/ThemeProvider.tsx#L42)

---

### useLanguage

▸ **useLanguage**(): `TranslatorProviderProps`

#### Returns

`TranslatorProviderProps`

#### Defined in

[packages/ui-components/src/providers/TranslatorProvider/TranslatorProvider.tsx:54](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/providers/TranslatorProvider/TranslatorProvider.tsx#L54)

---

### useVersion

▸ **useVersion**(): `Partial`<`DetailContextProps`\>

#### Returns

`Partial`<`DetailContextProps`\>

#### Defined in

[packages/ui-components/src/providers/VersionProvider/VersionProvider.tsx:92](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/providers/VersionProvider/VersionProvider.tsx#L92)

---

## Provider Functions

### TranslatorProvider

▸ **TranslatorProvider**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

Translator provider

#### Parameters

| Name                  | Type                                                                |
| :-------------------- | :------------------------------------------------------------------ |
| `props`               | `Object`                                                            |
| `props.children`      | `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\> |
| `props.i18n`          | `i18n`                                                              |
| `props.listLanguages` | `any`                                                               |
| `props.onMount`       | () => {}                                                            |
| `context?`            | `any`                                                               |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

### VersionProvider

▸ **VersionProvider**(`props`, `context?`): `null` \| `ReactElement`<`any`, `any`\>

**`Example`**

Once a component has been wrapped with `VersionProvider`, use the hook `useVersion()` to get an object with:

````jsx
function CustomComponent() {
const { packageMeta, packageName, packageVersion } = useVersion();
return <div />;
}

    <Route path={Routes.PACKAGE}>
      <VersionProvider>
        <CustomComponent />
      </VersionProvider>
    </Route>;
    ```
    On mount, the provider will fetch data from the store for specific package or version provided via router.

#### Parameters

| Name             | Type     |
| :--------------- | :------- |
| `props`          | `Object` |
| `props.children` | `any`    |
| `context?`       | `any`    |

#### Returns

`null` \| `ReactElement`<`any`, `any`\>

#### Defined in

node_modules/@types/react/index.d.ts:521

---

## HOC Functions

### loadable

▸ **loadable**(`importCallback`): (`props`: `any`) => `Element`

With the combination of a bundler, enable to code split a package.

**`Example`**

```jsx
   const VersionPage = loadable(() => import(/'../pages/Version'));
````

#### Parameters

| Name             | Type  |
| :--------------- | :---- |
| `importCallback` | `any` |

#### Returns

`fn`

▸ (`props`): `Element`

##### Parameters

| Name    | Type  |
| :------ | :---- |
| `props` | `any` |

##### Returns

`Element`

#### Defined in

[packages/ui-components/src/utils/loadable.tsx:13](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/utils/loadable.tsx#L13)

---

## Hooks Functions

### useLocalStorage

▸ **useLocalStorage**<`V`\>(`key`, `initialValue`): `any`[]

**`Example`**

```jsx
const [isDarkModeStorage, setIsDarkMode] = useLocalStorage('darkMode', isDarkModeDefault);
```

based on https://usehooks.com/useLocalStorage/

#### Type parameters

| Name |
| :--- |
| `V`  |

#### Parameters

| Name           | Type     |
| :------------- | :------- |
| `key`          | `string` |
| `initialValue` | `V`      |

#### Returns

`any`[]

#### Defined in

[packages/ui-components/src/hooks/useLocalStorage.ts:13](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/hooks/useLocalStorage.ts#L13)

---

### useOnClickOutside

▸ **useOnClickOutside**<`R`\>(`ref`, `handler`): `void`

**`Example`**

```ts
based on https://usehooks.com/useOnClickOutside/
```

#### Type parameters

| Name | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| :--- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `R`  | extends `HTMLElement` \| `HTMLDivElement` \| `HTMLObjectElement` \| `HTMLAnchorElement` \| `HTMLAreaElement` \| `HTMLAudioElement` \| `HTMLBaseElement` \| `HTMLQuoteElement` \| `HTMLBodyElement` \| `HTMLBRElement` \| `HTMLButtonElement` \| `HTMLCanvasElement` \| `HTMLTableColElement` \| `HTMLDataElement` \| `HTMLDataListElement` \| `HTMLModElement` \| `HTMLDetailsElement` \| `HTMLDialogElement` \| `HTMLDListElement` \| `HTMLEmbedElement` \| `HTMLFieldSetElement` \| `HTMLFormElement` \| `HTMLHeadingElement` \| `HTMLHeadElement` \| `HTMLHRElement` \| `HTMLHtmlElement` \| `HTMLIFrameElement` \| `HTMLImageElement` \| `HTMLInputElement` \| `HTMLLabelElement` \| `HTMLLegendElement` \| `HTMLLIElement` \| `HTMLLinkElement` \| `HTMLMapElement` \| `HTMLMetaElement` \| `HTMLMeterElement` \| `HTMLOListElement` \| `HTMLOptGroupElement` \| `HTMLOptionElement` \| `HTMLOutputElement` \| `HTMLParagraphElement` \| `HTMLPreElement` \| `HTMLProgressElement` \| `HTMLScriptElement` \| `HTMLSelectElement` \| `HTMLSlotElement` \| `HTMLSourceElement` \| `HTMLSpanElement` \| `HTMLStyleElement` \| `HTMLTableElement` \| `HTMLTableSectionElement` \| `HTMLTableCellElement` \| `HTMLTemplateElement` \| `HTMLTextAreaElement` \| `HTMLTimeElement` \| `HTMLTitleElement` \| `HTMLTableRowElement` \| `HTMLTrackElement` \| `HTMLUListElement` \| `HTMLVideoElement` \| `HTMLTableCaptionElement` \| `HTMLMenuElement` \| `HTMLPictureElement` |

#### Parameters

| Name      | Type                                              |
| :-------- | :------------------------------------------------ |
| `ref`     | `RefObject`<`R`\>                                 |
| `handler` | (`event`: `MouseEvent` \| `TouchEvent`) => `void` |

#### Returns

`void`

#### Defined in

[packages/ui-components/src/hooks/useOnClickOutside.ts:9](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/hooks/useOnClickOutside.ts#L9)
