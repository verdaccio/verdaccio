# GitHub OAuth Login with verdaccio-github-oauth-ui plugin and Verdaccio 6.x

This setup runs Verdaccio alongside Localstack, providing a simple test/mocking environment for
developing cloud applications. In this case, we are simulating AWS S3 functionality.

https://github.com/n4bb12/verdaccio-github-oauth-ui

## Configuration

Open `config.yaml` and modify the required properties follow the official documentation.

https://github.com/n4bb12/verdaccio-github-oauth-ui/blob/main/docs/configuration.md

## Usage

```bash
docker-compose up --force-recreate --build --always-recreate-deps
```
