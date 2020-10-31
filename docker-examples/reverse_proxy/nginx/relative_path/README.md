# Nginx Relative Path

This example runs two verdaccio versions:

- Running `verdaccio:4.x` http://localhost/verdaccio/
- Running the latest `verdaccio:3` http://localhost/verdacciov3/

Note: we should add more sort of configurations here.

**Nginx HTTP Example**

```bash
docker-compose up --build --force-recreate
```

open the browser

```
http://localhost/verdaccio/
```

**Nginx SSL Example**

```bash
docker-compose -f docker-compose_ssl.yml up --build --force-recreate
```

open the browser

```
https://localhost/verdaccio/
```
