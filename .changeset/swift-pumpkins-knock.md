---
'@verdaccio/auth': patch
'verdaccio-htpasswd': patch
---

Refactor htpasswd plugin to use the bcryptjs 'compare' api call instead of 'comparSync'. Add a new configuration value named 'slow_verify_ms' to the htpasswd plugin that when exceeded during password verification will log a warning message.
