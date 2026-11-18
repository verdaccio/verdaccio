---
'@verdaccio/middleware': patch
---

Fix requests returning 404 when Verdaccio's Express application is mounted under
a path such as `/registry`. The request logger now preserves the path Express
uses to route requests while continuing to log the complete original URL. This
restores web package listing, search, login, and registry API requests under the
mount path, including when middleware plugins continue asynchronously.

The default suppression of static-file and successful ping logs also works under
the mount path; failed pings remain visible. No configuration changes are needed.
The problem was reproduced on the 9.x development line at
`9.0.0-next-9.45`. The separate asynchronous web-routing failure reported in
Verdaccio 6.x requires the fixes for that release line.
