---
id: reverse-proxy
title: "Configuración de Proxy Inverso"
---
## Apache

Apache y mod_proxy no deberían decodificar/codificar barras y dejarlas como son:

    <VirtualHost *:80>
      AllowEncodedSlashes NoDecode
      ProxyPass /npm http://127.0.0.1:4873 nocanon
      ProxyPassReverse /npm http://127.0.0.1:4873
    </VirtualHost>
    

### Configuración con SSL

config.yaml

```yaml
url_prefix: https://npm.your.domain.com
```

Configuración del servidor virtual de Apache

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
            ProxyPass               /       http://127.0.0.1:4873 nocanon
            ProxyPassReverse        /       http://127.0.0.1:4873
        </VirtualHost>
        </IfModule>
    

## Nginx

    server {
      listen 80 default_server;
      location / {
        proxy_pass              http://127.0.0.1:4873/;
        proxy_set_header        Host $host;
      }
    }
    

## Ejecutar detrás del proxy inverso con un puerto y dominio diferente

If you run verdaccio behind reverse proxy, you may noticed all resource file served as relaticve path, like `http://127.0.0.1:4873/-/static`

Para resolver este problema, debes enviar el dominio real y el puerto a verdaccio con `Host` heade

La configuración Nginx debe lucir así:

```nginx
location / {
    proxy_pass http://127.0.0.1:4873/;
    proxy_set_header Host            $host:$server_port;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Para este caso, `url_prefix` NO debe establecerse en la configuración verdaccio

* * *

o a una instalación de sub-directorio:

```nginx
location ~ ^/verdaccio/(.*)$ {
    proxy_pass http://127.0.0.1:4873/$1;
    proxy_set_header Host            $host:$server_port;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Para este caso, `url_prefix` debe establecerse a `/verdaccio/`

> Nota: Hay una Barra oblicua después de la ruta de instalación (`https://your-domain:port/vardaccio/`)!