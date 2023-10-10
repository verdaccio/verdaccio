---
id: 'ErrorBoundary'
title: 'Class: ErrorBoundary'
sidebar_label: 'ErrorBoundary'
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `Component`<`ErrorProps`, `ErrorAppState`\>

  ↳ **`ErrorBoundary`**

## Constructors

### constructor

• **new ErrorBoundary**(`props`)

#### Parameters

| Name    | Type         |
| :------ | :----------- |
| `props` | `ErrorProps` |

#### Overrides

Component&lt;ErrorProps, ErrorAppState\&gt;.constructor

#### Defined in

[packages/ui-components/src/components/ErrorBoundary/ErrorBoundary.tsx:14](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/components/ErrorBoundary/ErrorBoundary.tsx#L14)

## Properties

### context

• **context**: `unknown`

If using the new style context, re-declare this in your class to be the
`React.ContextType` of your `static contextType`.
Should be used with type annotation or static contextType.

```ts
static contextType = MyContext
// For TS pre-3.7:
context!: React.ContextType<typeof MyContext>
// For TS 3.7 and above:
declare context: React.ContextType<typeof MyContext>
```

**`See`**

https://reactjs.org/docs/context.html

#### Inherited from

Component.context

#### Defined in

node_modules/@types/react/index.d.ts:471

---

### props

• `Readonly` **props**: `Readonly`<`ErrorProps`\>

#### Inherited from

Component.props

#### Defined in

node_modules/@types/react/index.d.ts:491

---

### refs

• **refs**: `Object`

**`Deprecated`**

https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs

#### Index signature

▪ [key: `string`]: `ReactInstance`

#### Inherited from

Component.refs

#### Defined in

node_modules/@types/react/index.d.ts:497

---

### state

• **state**: `Readonly`<`ErrorAppState`\>

#### Inherited from

Component.state

#### Defined in

node_modules/@types/react/index.d.ts:492

---

### contextType

▪ `Static` `Optional` **contextType**: `Context`<`any`\>

If set, `this.context` will be set at runtime to the current value of the given Context.

Usage:

```ts
type MyContext = number;
const Ctx = React.createContext<MyContext>(0);

class Foo extends React.Component {
  static contextType = Ctx;
  context!: React.ContextType<typeof Ctx>;
  render() {
    return <>My context's value: {this.context}</>;
  }
}
```

**`See`**

https://reactjs.org/docs/context.html#classcontexttype

#### Inherited from

Component.contextType

#### Defined in

node_modules/@types/react/index.d.ts:454

## Methods

### UNSAFE_componentWillMount

▸ `Optional` **UNSAFE_componentWillMount**(): `void`

Called immediately before mounting occurs, and before `Component#render`.
Avoid introducing any side-effects or subscriptions in this method.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`Deprecated`**

16.3, use componentDidMount or the constructor instead

**`See`**

- https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state
- https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Returns

`void`

#### Inherited from

Component.UNSAFE_componentWillMount

#### Defined in

node_modules/@types/react/index.d.ts:688

---

### UNSAFE_componentWillReceiveProps

▸ `Optional` **UNSAFE_componentWillReceiveProps**(`nextProps`, `nextContext`): `void`

Called when the component may be receiving new props.
React may call this even if props have not changed, so be sure to compare new and existing
props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`Deprecated`**

16.3, use static getDerivedStateFromProps instead

**`See`**

- https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props
- https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Parameters

| Name          | Type                      |
| :------------ | :------------------------ |
| `nextProps`   | `Readonly`<`ErrorProps`\> |
| `nextContext` | `any`                     |

#### Returns

`void`

#### Inherited from

Component.UNSAFE_componentWillReceiveProps

#### Defined in

node_modules/@types/react/index.d.ts:720

---

### UNSAFE_componentWillUpdate

▸ `Optional` **UNSAFE_componentWillUpdate**(`nextProps`, `nextState`, `nextContext`): `void`

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`Deprecated`**

16.3, use getSnapshotBeforeUpdate instead

**`See`**

- https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update
- https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Parameters

| Name          | Type                         |
| :------------ | :--------------------------- |
| `nextProps`   | `Readonly`<`ErrorProps`\>    |
| `nextState`   | `Readonly`<`ErrorAppState`\> |
| `nextContext` | `any`                        |

#### Returns

`void`

#### Inherited from

Component.UNSAFE_componentWillUpdate

#### Defined in

node_modules/@types/react/index.d.ts:748

---

### componentDidCatch

▸ **componentDidCatch**(`error`, `info`): `void`

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `error` | `Error`  |
| `info`  | `object` |

#### Returns

`void`

#### Overrides

Component.componentDidCatch

#### Defined in

[packages/ui-components/src/components/ErrorBoundary/ErrorBoundary.tsx:19](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/components/ErrorBoundary/ErrorBoundary.tsx#L19)

---

### componentDidMount

▸ `Optional` **componentDidMount**(): `void`

Called immediately after a component is mounted. Setting state here will trigger re-rendering.

#### Returns

`void`

#### Inherited from

Component.componentDidMount

#### Defined in

node_modules/@types/react/index.d.ts:596

---

### componentDidUpdate

▸ `Optional` **componentDidUpdate**(`prevProps`, `prevState`, `snapshot?`): `void`

Called immediately after updating occurs. Not called for the initial render.

The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.

#### Parameters

| Name        | Type                         |
| :---------- | :--------------------------- |
| `prevProps` | `Readonly`<`ErrorProps`\>    |
| `prevState` | `Readonly`<`ErrorAppState`\> |
| `snapshot?` | `any`                        |

#### Returns

`void`

#### Inherited from

Component.componentDidUpdate

#### Defined in

node_modules/@types/react/index.d.ts:659

---

### componentWillMount

▸ `Optional` **componentWillMount**(): `void`

Called immediately before mounting occurs, and before `Component#render`.
Avoid introducing any side-effects or subscriptions in this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`Deprecated`**

16.3, use componentDidMount or the constructor instead; will stop working in React 17

**`See`**

- https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state
- https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Returns

`void`

#### Inherited from

Component.componentWillMount

#### Defined in

node_modules/@types/react/index.d.ts:674

---

### componentWillReceiveProps

▸ `Optional` **componentWillReceiveProps**(`nextProps`, `nextContext`): `void`

Called when the component may be receiving new props.
React may call this even if props have not changed, so be sure to compare new and existing
props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`Deprecated`**

16.3, use static getDerivedStateFromProps instead; will stop working in React 17

**`See`**

- https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props
- https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Parameters

| Name          | Type                      |
| :------------ | :------------------------ |
| `nextProps`   | `Readonly`<`ErrorProps`\> |
| `nextContext` | `any`                     |

#### Returns

`void`

#### Inherited from

Component.componentWillReceiveProps

#### Defined in

node_modules/@types/react/index.d.ts:703

---

### componentWillUnmount

▸ `Optional` **componentWillUnmount**(): `void`

Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as
cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.

#### Returns

`void`

#### Inherited from

Component.componentWillUnmount

#### Defined in

node_modules/@types/react/index.d.ts:612

---

### componentWillUpdate

▸ `Optional` **componentWillUpdate**(`nextProps`, `nextState`, `nextContext`): `void`

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`Deprecated`**

16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17

**`See`**

- https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update
- https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Parameters

| Name          | Type                         |
| :------------ | :--------------------------- |
| `nextProps`   | `Readonly`<`ErrorProps`\>    |
| `nextState`   | `Readonly`<`ErrorAppState`\> |
| `nextContext` | `any`                        |

#### Returns

`void`

#### Inherited from

Component.componentWillUpdate

#### Defined in

node_modules/@types/react/index.d.ts:733

---

### forceUpdate

▸ **forceUpdate**(`callback?`): `void`

#### Parameters

| Name        | Type         |
| :---------- | :----------- |
| `callback?` | () => `void` |

#### Returns

`void`

#### Inherited from

Component.forceUpdate

#### Defined in

node_modules/@types/react/index.d.ts:488

---

### getSnapshotBeforeUpdate

▸ `Optional` **getSnapshotBeforeUpdate**(`prevProps`, `prevState`): `any`

Runs before React applies the result of `render` to the document, and
returns an object to be given to componentDidUpdate. Useful for saving
things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated
lifecycle events from running.

#### Parameters

| Name        | Type                         |
| :---------- | :--------------------------- |
| `prevProps` | `Readonly`<`ErrorProps`\>    |
| `prevState` | `Readonly`<`ErrorAppState`\> |

#### Returns

`any`

#### Inherited from

Component.getSnapshotBeforeUpdate

#### Defined in

node_modules/@types/react/index.d.ts:653

---

### render

▸ **render**(): `Element`

#### Returns

`Element`

#### Overrides

Component.render

#### Defined in

[packages/ui-components/src/components/ErrorBoundary/ErrorBoundary.tsx:23](https://github.com/verdaccio/verdaccio/blob/10057a4ff/packages/ui-components/src/components/ErrorBoundary/ErrorBoundary.tsx#L23)

---

### setState

▸ **setState**<`K`\>(`state`, `callback?`): `void`

#### Type parameters

| Name | Type                          |
| :--- | :---------------------------- |
| `K`  | extends keyof `ErrorAppState` |

#### Parameters

| Name        | Type                                                                                                                                                                                                        |
| :---------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `state`     | `null` \| `ErrorAppState` \| (`prevState`: `Readonly`<`ErrorAppState`\>, `props`: `Readonly`<`ErrorProps`\>) => `null` \| `ErrorAppState` \| `Pick`<`ErrorAppState`, `K`\> \| `Pick`<`ErrorAppState`, `K`\> |
| `callback?` | () => `void`                                                                                                                                                                                                |

#### Returns

`void`

#### Inherited from

Component.setState

#### Defined in

node_modules/@types/react/index.d.ts:483

---

### shouldComponentUpdate

▸ `Optional` **shouldComponentUpdate**(`nextProps`, `nextState`, `nextContext`): `boolean`

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true.
`PureComponent` implements a shallow comparison on props and state and returns true if any
props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate`
and `componentDidUpdate` will not be called.

#### Parameters

| Name          | Type                         |
| :------------ | :--------------------------- |
| `nextProps`   | `Readonly`<`ErrorProps`\>    |
| `nextState`   | `Readonly`<`ErrorAppState`\> |
| `nextContext` | `any`                        |

#### Returns

`boolean`

#### Inherited from

Component.shouldComponentUpdate

#### Defined in

node_modules/@types/react/index.d.ts:607
