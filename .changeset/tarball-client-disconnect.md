---
'verdaccio': patch
---

Fix tarball downloads keeping storage and uplink resources open after the client disconnects.

When a client closed the connection in the middle of a tarball download (an interrupted `npm install`, a CI job that was cancelled, a proxy timeout), the registry kept the read open: the file descriptor of a locally stored tarball was never released, and a tarball being proxied from an uplink stayed stuck with its uplink connection and its partial cache file left behind. Storage plugins that hold a network connection per read, such as an S3 backend, were affected the same way. Under enough interrupted downloads the process ran out of file descriptors or connections.

The registry now notices that the client is gone and stops the work it started for that request: the storage read is aborted, the uplink request is cancelled, and a partially cached tarball is discarded, so the next request downloads it again from the uplink. A disconnect that happens before the tarball read begins no longer starts it. Downloads that complete are unchanged, and an interrupted download does not count as an uplink failure.

No configuration change is needed. Custom storage plugins are asked to stop through the `abort()` method of the stream returned by `readTarball`, as the plugin contract already defines. All previous 6.x releases were affected.
