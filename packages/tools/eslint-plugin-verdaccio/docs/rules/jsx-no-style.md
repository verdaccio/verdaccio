# disallow style on jsx components (jsx-no-style)

Please describe the origin of the rule here.

## Rule Details

This rule checks whether the first property of all JSX elements is correctly placed. There are the possible configurations:

- `always`: The style attribute is invalid as JSX attribute.
- `never` : The style attribute is allowed as JSX attribute.

Examples of **incorrect** code for this rule:

```js

 <span key={String(index)} href={suggestion.link} style={{ fontWeight: fontWeight.semiBold }}>
   {part.text}
 </span>

 <InputAdornment position="start" style={{ color: colors.white }}>
	<IconSearch />
</InputAdornment>

```

Examples of **correct** code for this rule:

```js

 <span key={String(index)} href={suggestion.link} className="bar">
   {part.text}
 </span>

<InputAdornment position="start" className="foo">
     <IconSearch />
</InputAdornment>

```
