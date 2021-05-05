---
'@verdaccio/types': minor
'@verdaccio/ui-theme': minor
'@verdaccio/web': minor
---

allow disable login on ui and endpoints

To be able disable the login, set `login: false`, anything else would enable login. This flag will disable access via UI and web endpoints.

```yml
web:
  title: verdaccio
  login: false
```
