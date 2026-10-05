---
'@verdaccio/middleware': patch
---

Mask the `npm-otp` request header in logs, alongside authorization and cookie headers.
Requests carrying a one-time password now log `<Classified>` instead of its value,
without requiring a custom `log.redact` rule. Existing redaction rules still apply.
The original headers remain available to subsequent middleware, including error
handlers if request logging fails. No configuration changes are required.
