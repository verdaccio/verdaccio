# check the usage of nested objects as classnames (jsx-no-classname-object)

Please describe the origin of the rule here.

## Rule Details

This rule checks whether the first property of all JSX elements is correctly placed. There are the possible configurations:

- `always`: The className attribute does not allow object expressions
- `never` : The className attribute does allow object expressions

Examples of **incorrect** code for this rule:

```js
('<div className="{}"/>',
  '<div className={"test"}/>',
  '<div className="test"/>',
  '<div className={this.getClassName()}/>');
```

Examples of **correct** code for this rule:

```js
'<div className={{fontSize: \'12px\'}}/>';
```
