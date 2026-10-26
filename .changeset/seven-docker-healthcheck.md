---
'verdaccio': patch
---

Remove the `HEALTHCHECK` from the Docker image.

The probe used `localhost`, which resolves to `::1` on Alpine, while the image listens on IPv4 only by default. The container was always reported as `unhealthy` even though it served requests normally. The image no longer declares a health check, as in `6.x`; see [the Docker page](https://verdaccio.org/docs/docker#healthcheck) to add one in your compose file or orchestrator if you need it.
