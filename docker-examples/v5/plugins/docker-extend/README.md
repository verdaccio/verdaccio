# Extending Verdaccio 5 using Yarn 2

Extending Verdaccio 5 with `verdaccio-aws-s3-storage` plugin.


```bash
docker build -t verdaccio/verdaccio:local-s3 . --no-cache
```

```bash
docker-compose up
```

> It's intended to fail since the S3 connection won't be stablished
