---
id: reverse-proxy
title: "Reverse Proxy Setup"
---
## Apache

Apache i mod_proxy ne treba da decode/encode slashes, tako da je najbolje da ostavite podešavanja takva kakva su:

    <VirtualHost *:80>
      AllowEncodedSlashes NoDecode
      ProxyPass /npm http://127.0.0.1:4873 nocanon
      ProxyPassReverse /npm http://127.0.0.1:4873
    </VirtualHost>
    

### Konfigurisanje sa SSL

config.yaml

```yaml
url_prefix: https://npm.your.domain.com
```

Konfiguracija Apache virtual servera

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
    

## Pokrenite behind reverse proxy sa različitim domenom i portom

Ako pokrenete verdaccio behind reverse proxy, možda ćete primetiti sve resource fajlove servirane kao relaticve path, na primer `http://127.0.0.1:4873/-/static`

Kako biste rešili navedeni problem, trebalo bi da pošaljete real domain i port do verdaccio-a sa `Host` header-om

Nginx konfigurisanje bi trebalo da izgleda ovako:

```nginx
location / {
    proxy_pass http://127.0.0.1:4873/;
    proxy_set_header Host            $host:$server_port;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

U ovom slučaju, `url_prefix` NE treba da podešava verdaccio config

* * *

ili, instalacija pod-direktorijuma:

```nginx
location ~ ^/verdaccio/(.*)$ {
    proxy_pass http://127.0.0.1:4873/$1;
    proxy_set_header Host            $host:$server_port;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

U ovom slučaju, `url_prefix` treba podesiti na `/verdaccio/`

> Napomena: Postoji Slash posle putanje za instalaciju (`https://your-domain:port/verdaccio/`)!