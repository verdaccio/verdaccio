# Verdaccio and Apache2

Running `verdaccio` via reverse proxy is a common practice. This configuration provides a quick way to run the application through **apache2** as reverse proxy.

To run the containers, run the following command in this folder, it should start the containers in detach mode.

```bash
 docker-compose up -d
```

To recreate the nginx image you can force the build.

```bash
 docker-compose up --build -d

 Building apacheproxy
Step 1/5 : FROM eboraas/apache
 ---> 1ba66e3f5580
Step 2/5 : MAINTAINER Juan Picado <juanpicado19@gmail.com>
 ---> Using cache
 ---> 4317b29c20ec
Step 3/5 : RUN a2enmod proxy
 ---> Using cache
 ---> b9334b33e2f1
Step 4/5 : COPY ./conf/000-default.conf /etc/apache2/sites-enabled/000-default.conf
 ---> Using cache
 ---> 6d464388db8f
Step 5/5 : COPY ./conf/env.load /etc/apache2/mods-enabled/env.load
 ---> Using cache
 ---> 66740b6ffb97
Successfully built 66740b6ffb97
Recreating verdaccio
Recreating apacheverdaccio_apacheproxy_1
```

To force recreate the images.

```bash
docker-compose up --build --force-recreate -d
```

To stop all containers

```bash
docker-compose stop
```

To display container logs

```bash
$> docker-compose logs
Attaching to apacheverdaccio_apacheproxy_1, verdaccio
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

To access the apache logs

```bash
&> docker exec -it {ID} /bin/bash

root@da8ee3cb484c:~# tail -f /var/log/apache2/verdaccio-access.log
172.20.0.1 - - [31/May/2017:21:16:37 +0000] "GET /xmlhttprequest-ssl HTTP/1.1" 200 2616 "install sails" "npm/5.0.0 node/v4.6.1 darwin x64"
172.20.0.1 - - [31/May/2017:21:16:37 +0000] "GET /yeast HTTP/1.1" 200 2706 "install sails" "npm/5.0.0 node/v4.6.1 darwin x64"
172.20.0.1 - - [31/May/2017:21:16:37 +0000] "GET /has-cors HTTP/1.1" 200 1347 "install sails" "npm/5.0.0 node/v4.6.1 darwin x64"
172.20.0.1 - - [31/May/2017:21:16:37 +0000] "GET /parsejson HTTP/1.1" 200 1234 "install sails" "npm/5.0.0 node/v4.6.1 darwin x64"
172.20.0.1 - - [31/May/2017:21:16:37 +0000] "GET /better-assert HTTP/1.1" 200 2462 "install sails" "npm/5.0.0 node/v4.6.1 darwin x64"
172.20.0.1 - - [31/May/2017:21:16:37 +0000] "GET /callsite HTTP/1.1" 200 1369 "install sails" "npm/5.0.0 node/v4.6.1 darwin x64"
172.20.0.1 - - [31/May/2017:21:16:37 +0000] "GET /dot-access HTTP/1.1" 200 1477 "install sails" "npm/5.0.0 node/v4.6.1 darwin x64"
172.20.0.1 - - [31/May/2017:21:16:37 +0000] "GET /skipper-disk HTTP/1.1" 200 3801 "install sails" "npm/5.0.0 node/v4.6.1 darwin x64"
172.20.0.1 - - [31/May/2017:21:16:37 +0000] "GET /native-or-bluebird HTTP/1.1" 200 2257 "install sails" "npm/5.0.0 node/v4.6.1 darwin x64"
172.20.0.1 - - [31/May/2017:21:16:37 +0000] "GET /foreachasync HTTP/1.1" 200 2742 "install sails" "npm/5.0.0 node/v4.6.1 darwin x64"
tail: unrecognized file system type 0x794c7630 for '/var/log/apache2/verdaccio-access.log'. please report this to bug-coreutils@gnu.org. reverting to polling
```

### Display Information

To display the containers running

```bash
&> docker-compose ps
            Name                           Command               State              Ports
----------------------------------------------------------------------------------------------------
apacheverdaccio_apacheproxy_1   /usr/sbin/apache2ctl -D FO ...   Up      443/tcp, 0.0.0.0:80->80/tcp
verdaccio                       /usr/src/app/bin/verdaccio ...   Up      0.0.0.0:4873->4873/tcp
```
