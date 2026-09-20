---
'@verdaccio/web': patch
---

fix: prevent browser basic auth popup on WebUI login failure

Set WWW-Authenticate header to Bearer only (excluding Basic) on 401 responses
from the WebUI login endpoint, so browsers do not show a native authentication
popup when credentials are invalid.

Closes #5814
