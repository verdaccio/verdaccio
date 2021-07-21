---
id: reverse-proxy
title: "Reverse Proxy Setup"
---

Using a reverse proxy is a common practice. The following configurations are the
most recommended and used ones.

# Apache

Apache and `mod_proxy` should **not decode/encode slashes** and leave them as they are:

For installing at relative path, `/npm`, on the server

````
<VirtualHost *:80>
  AllowEncodedSlashes NoDecode
  ProxyPass /npm http://127.0.0.1:4873 nocanon
  ProxyPassReverse /npm http://127.0.0.1:4873
</VirtualHost>
````

For installing at root path, `/`, on the server
````
<VirtualHost *:80>
  ServerName your.domain.com
  ServerAdmin hello@your.domain.com
  ProxyPreserveHost On
  AllowEncodedSlashes NoDecode
  ProxyPass / http://127.0.0.1:4873/ nocanon
  ProxyPassReverse / http://127.0.0.1:4873/
</VirtualHost>
````

### Configuration with SSL {#configuration-with-ssl}

Apache virtual server configuration

````
    apacheconfig
    <IfModule mod_ssl.c>
    <VirtualHost *:443>
        ServerName npm.your.domain.com
        SSLEngine on
        SSLCertificateFile      /etc/letsencrypt/live/npm.your.domain.com/fullchain.pem
        SSLCertificateKeyFile   /etc/letsencrypt/live/npm.your.domain.com/privkey.pem
        SSLProxyEngine          On
        ProxyRequests           Off
        ProxyPreserveHost       On
        AllowEncodedSlashes     NoDecode
        ProxyPass               /       http://127.0.0.1:4873/ nocanon
        ProxyPassReverse        /       http://127.0.0.1:4873/
        RequestHeader set       X-Forwarded-Proto "https"
    </VirtualHost>
    </IfModule>
````

# Nginx

The following snippet is a full `docker` example can be tested in our [Docker examples repository](https://github.com/verdaccio/verdaccio/tree/5.x/docker-examples/reverse_proxy/nginx).

````
upstream verdaccio_v4 {
    server verdaccio_relative_path_v4:4873;
    keepalive 8;
}

upstream verdaccio_v4_root {
    server verdaccio_relative_path_v4_root:8000;
    keepalive 8;
}

upstream verdaccio_v3 {
    server verdaccio_relative_path_latest_v3:7771;
    keepalive 8;
}

server {
    listen 80 default_server;
    access_log /var/log/nginx/verdaccio.log;
    charset utf-8;

    location / {
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $host;
      proxy_set_header X-NginX-Proxy true;
      proxy_pass http://verdaccio_v4_root;
      proxy_redirect off;
    }

    location ~ ^/verdaccio/(.*)$ {
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $host;
      proxy_set_header X-NginX-Proxy true;
      proxy_pass http://verdaccio_v4/$1;
      proxy_redirect off;
    }

    location ~ ^/verdacciov3/(.*)$ {
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $host;
      proxy_set_header X-NginX-Proxy true;

      proxy_pass http://verdaccio_v3/$1;
      proxy_redirect off;
    }
}
````

## SSL example {#ssl-example}

````
server {
    listen 80;
    return 302 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name localhost;

    ssl_certificate     /etc/nginx/cert.crt;
    ssl_certificate_key /etc/nginx/cert.key;

    ssl on;
    ssl_session_cache  builtin:1000  shared:SSL:10m;
    ssl_protocols  TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers HIGH:!aNULL:!eNULL:!EXPORT:!CAMELLIA:!DES:!MD5:!PSK:!RC4;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_set_header    Host $host;
        proxy_set_header    X-Real-IP $remote_addr;
        proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header    X-Forwarded-Proto $scheme;
        proxy_pass          http://verdaccio_v4_root;
        proxy_read_timeout  600;
        proxy_redirect off;
    }

    location ~ ^/verdaccio/(.*)$ {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://verdaccio_v4_root/$1;
        proxy_redirect off;
    }
}
````

## Run behind reverse proxy with different domain and port {#run-behind-reverse-proxy-with-different-domain-and-port}

### Sub-directory {#sub-directory}

If the whole URL is being used for Verdaccio, you don't need to define a `url_prefix`, otherwise
you would need something like this in your `config.yaml`.

```yaml
url_prefix: /sub_directory/
```

If you run Verdaccio behind reverse proxy, you may noticed all resource file served as relative path, like `http://127.0.0.1:4873/-/static`

To resolve this issue, **you should send real domain and port to Verdaccio with `Host` header**

Nginx configure should look like this:

```nginx
location / {
    proxy_pass http://127.0.0.1:4873/;
    proxy_set_header Host            $host:$server_port;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```
For this case, `url_prefix` should **NOT** set in Verdaccio config

---

or a sub-directory installation:

```nginx
location ~ ^/verdaccio/(.*)$ {
    proxy_pass http://127.0.0.1:4873/$1;
    proxy_set_header Host            $host:$server_port;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```
For this case, `url_prefix` should set to `/verdaccio/`

> Note: There is a slash after the install path (`https://your-domain:port/verdaccio/`)!
