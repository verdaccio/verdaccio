# spread over jsx (jsx-spread)

Please describe the origin of the rule here.

## Rule Details

This rule checks whether the first property of all JSX elements is correctly placed. There are the possible configurations:

- `always`: The spread operator is invalid as JSX attribute.
- `never` : The spread operator is allowed as JSX attribute.

Examples of **incorrect** code for this rule:

```js

<div {...props}>

```

Examples of **correct** code for this rule:

```js
<div foo="1" bar="2" />
```
