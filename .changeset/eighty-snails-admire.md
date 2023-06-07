---
'@verdaccio/server-fastify': patch
'@verdaccio/web': patch
---

Fix the password validation logic for the `/reset_password` route to ensure that the password is only reset if it is valid.
