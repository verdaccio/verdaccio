---
'@verdaccio/ui-components': patch
---

Auth token storage review fixes: logging out read the still-valid session from localStorage before clearing it, so the React state was re-hydrated as logged-in (masked only by the page reload that follows); a malformed token was printed verbatim to the browser console by the expiry check (credential material never belongs in logs); and the auth provider re-read storage and re-decoded the JWT on every render (now a lazy state initializer). The storage lifecycle — hydrate from valid token, purge expired/malformed tokens on boot, full cleanup on logout — is now locked by tests.
