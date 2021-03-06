# Verdaccio and Nginx

Running `verdaccio` via reverse proxy is a common practice. This configuration provides a quick way to run the application behind **nginx**.

This folder provides the following examples:

- root_path: Using reverse proxy with `/` as a path.
- relative_path: Using `/verdaccio/` as a subdirectory. It includes also SSL examples with reverse proxy.

To run the containers, run the following commands in this folder. The containers should start in detach mode.

```bash
 docker-compose up -d
```

To recreate the nginx image you can force the build.

```bash
 docker-compose up --build -d
```

To force recreate the images.

```bash
docker-compose up --build --force-recreate  -d
```

To stop all containers

```bash
docker-compose stop
```

To display container logs

```bash
$> docker-compose logs
Attaching to nginxverdaccio_nginx_1, verdaccio
verdaccio    |  warn --- config file  - /verdaccio/conf/config.yaml
verdaccio    |  warn --- http address - http://0.0.0.0:4873/ - verdaccio/2.1.7
verdaccio    |  http <-- 304, user: undefined, req: 'GET /', bytes: 0/0
verdaccio    |  http <-- 304, user: undefined, req: 'GET /-/static/jquery.min.js', bytes: 0/0
verdaccio    |  http <-- 304, user: undefined, req: 'GET /-/static/main.css', bytes: 0/0
verdaccio    |  http <-- 304, user: undefined, req: 'GET /-/static/main.js', bytes: 0/0
verdaccio    |  http <-- 304, user: undefined, req: 'GET /-/logo', bytes: 0/0
verdaccio    |  http <-- 304, user: undefined, req: 'GET /-/static/fontello.woff?10872183', bytes: 0/0
verdaccio    |  http <-- 200, user: undefined, req: 'GET /-/static/favicon.png', bytes: 0/315
```

### Display Information

To display the containers running

```bash
&> docker-compose ps
         Name                       Command               State           Ports
----------------------------------------------------------------------------------------
nginxverdaccio_nginx_1   /usr/sbin/nginx                  Up      0.0.0.0:80->80/tcp
verdaccio                /usr/src/app/bin/verdaccio ...   Up      0.0.0.0:4873->4873/tcp
```
