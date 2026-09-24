---
'@verdaccio/store': patch
---

Stop revalidating uplink metadata on every request once `maxage` expires.

A `304 Not Modified` from an uplink was handled as a failure, so the `fetched`
timestamp of the cached manifest was never refreshed. Once `maxage` expired the
cache never looked fresh again and every single request revalidated against the
uplink; with several uplinks configured, a 304 from one of them also caused
avoidable requests to the rest. Verdaccio now treats the 304 as what it is — the
uplink confirming the cached manifest is current — refreshes the timestamp,
keeps checking the remaining uplinks for newer data, and serves from cache until
`maxage` expires again.

This affects the 9.x and 7.x lines since the uplink client was migrated to
`got`; 6.x already behaved this way. Clients that read the full packument
(rather than the abbreviated install metadata) will see a new ETag after each
refresh, because the cached manifest is written back with a new revision.
