# `VersionProvider`

Use the hook `useVersion()` to get an object with:

- packageMeta
- packageName
- packageVersion

The provider must be

```jsx
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
