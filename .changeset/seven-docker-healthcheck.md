---
'verdaccio': patch
---

Remove the `HEALTHCHECK` from the Docker image.

The probe used `localhost`, which resolves to `::1` on Alpine, while the image listens on IPv4 only by default. The container was always reported as `unhealthy` even though it served requests normally. The image no longer declares a health check, as in `6.x`.

If you need one, add it yourself probing `127.0.0.1`, for example in `docker-compose.yaml`:

```yaml
services:
  verdaccio:
    image: verdaccio/verdaccio
    healthcheck:
      test: ['CMD-SHELL', 'wget --quiet --tries=1 --spider http://127.0.0.1:4873/-/ping || exit 1']
      interval: 30s
      timeout: 5s
      start_period: 10s
      retries: 3
```

See [Health check](https://verdaccio.org/docs/docker#healthcheck) in the Docker documentation for the `docker run` and HTTPS variants.
