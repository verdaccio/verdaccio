# Amazon S3 Bucket (Localstack) and Verdaccio 6.x

This setup runs Verdaccio alongside Localstack, providing a simple test/mocking environment for
developing cloud applications. In this case, we are simulating AWS S3 functionality.

## Usage

> You might need to create bucket manually here
> aws --endpoint-url=http://localhost:4572 s3 mb s3://localstack.s3.plugin.test

```
docker-compose up --force-recreate --build --always-recreate-deps
```

## Articles

- [Set up S3 bucket using Docker / Compose](https://discuss.localstack.cloud/t/set-up-s3-bucket-using-docker-compose/646.html)
