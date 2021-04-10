# Nginx Relative Path with Verdaccio 5

This example runs two verdaccio versions:

- Running `verdaccio:5.x` http://localhost/verdaccio/

Note: we should add more sort of configurations here.

**Nginx HTTP Example**

```bash
docker-compose up --build --force-recreate
```

open the browser

```
http://localhost/relative_path/
```

**Nginx SSL Example**

```bash
docker-compose -f docker-compose_ssl.yml up --build --force-recreate
```

open the browser

```
https://localhost/verdaccio/
```
