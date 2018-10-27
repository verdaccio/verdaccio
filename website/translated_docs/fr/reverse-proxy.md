---
id: reverse-proxy
title: "Reverse Proxy Setup"
---
## Apache

Apache and mod_proxy should not decode/encode slashes and leave them as they are:

    <VirtualHost *:80>
      AllowEncodedSlashes NoDecode
      ProxyPass /npm http://127.0.0.1:4873 nocanon
      ProxyPassReverse /npm http://127.0.0.1:4873
    </VirtualHost>
    

### Configuration with SSL

config.yaml

```yaml
url_prefix: https://npm.your.domain.com
```

Configuration du serveur virtuel Apache

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
    

## Commencer derrière le proxy inverse avec un domaine et un port différents

Si vous exécutez verdaccio derrière le proxy inverse, vous remarqueriez que tous les fichiers de ressources fonctionnent comme des chemins associés, tels que `http://127.0.0.1:4873/-/static`

Pour résoudre le problème, vous devez envoyer le domaine réel et le port avec l'en-tête `Host` à verdaccio

La configuration de Nginx devrait ressembler à ceci:

```nginx
location / {
    proxy_pass http://127.0.0.1:4873/;
    proxy_set_header Host            $host:$server_port;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Dans ce cas, `url_prefix` ne doit pas être défini dans la configuration de verdaccio

* * *

ou dans l'installation d'un sous-dossier:

```nginx
location ~ ^/verdaccio/(.*)$ {
    proxy_pass http://127.0.0.1:4873/$1;
    proxy_set_header Host            $host:$server_port;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Dans ce cas, `url_prefix` doit être défini sur `/verdaccio/`

> Note: There is a Slash after install path (`https://your-domain:port/verdaccio/`)!