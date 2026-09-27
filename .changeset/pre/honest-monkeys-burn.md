---
'@verdaccio/middleware': patch
'@verdaccio/server': patch
'@verdaccio/config': patch
'@verdaccio/types': patch
---

feat(middleware): add `server.hidePingLogs` to suppress successful `/-/ping` logs (defaults to true; failed pings are still logged)
