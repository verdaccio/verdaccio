---
'verdaccio': patch
---

fix: apply package access controls to the `starredByUser` endpoint

The `GET /-/_view/starredByUser` view did not enforce the configured package
access policy when listing a user's starred packages. Results are now filtered
through `auth.allow_access`, so the response only includes packages the
requesting client is authorized to see.
