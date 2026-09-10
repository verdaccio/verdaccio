---
'@verdaccio/ui-components': patch
---

Annotate the `useLoginForm` return type so declaration emit no longer fails

The inferred return type referenced `react-hook-form`'s internal `FormState`,
which `tsc --emitDeclarationOnly` could not name portably (TS2883). Declaring the
return as `UseFormReturn<LoginFormValues> & { onSubmit }` fixes the build.
