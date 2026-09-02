---
'verdaccio': patch
---

fix: validate the scope segment on the web package endpoints

The readme and sidebar web endpoints now validate the `:scope` route segment
and return 404 for malformed requests.
