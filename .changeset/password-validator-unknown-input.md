---
'@verdaccio/core': patch
---

Correct the input type of the shared password validator in the 8.x modules used by Verdaccio 6.x.

TypeScript callers can pass unknown input directly to `validatePassword` without a type assertion. The validator continues to reject non-string values and apply the supplied password policy to strings, including permissive policies for checking existing credentials. No configuration changes are required.
