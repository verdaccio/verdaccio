---
'@verdaccio/ui-components': patch
---

The web "create user" form submitted to `PUT /-/web/add-user:username`, a URL that only serves the SPA, so signup always failed with any input. It now calls the real signup endpoint (`PUT /-/verdaccio/sec/signup`) including the `sessionId` the server requires, and logs the new user in when the server returns a token.
