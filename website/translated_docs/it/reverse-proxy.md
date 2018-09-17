---
id: reverse-proxy
title: "Configurazione di Proxy inverso"
---
## Apache

Apache e mod_proxy non dovrebbero decodificare/codificare gli slash e dovrebbero lasciarli così come sono:

    <VirtualHost *:80>
      AllowEncodedSlashes NoDecode
      ProxyPass /npm http://127.0.0.1:4873 nocanon
      ProxyPassReverse /npm http://127.0.0.1:4873
    </VirtualHost>
    

### Configurazione con SSL

config.yaml

```yaml
url_prefix: https://npm.your.domain.com
```

Configurazione del server virtuale Apache

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
    

## Avvio dietro al proxy inverso con dominio e porta differenti

Se esegui verdaccio dietro al proxy inverso, potresti notare che tutti i file risorsa funzionano come percorsi correlati, come ` http://127.0.0.1:4873/-/static `

To resolve this issue, you should send real domain and port to verdaccio with `Host` header

La configurazione di Nginx dovrebbe apparire così:

```nginx
location / {
    proxy_pass http://127.0.0.1:4873/;
    proxy_set_header Host            $host:$server_port;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

In questo caso, `url_prefix` non dovrebbe essere impostato nella configurazione di verdaccio

* * *

o nell'installazione di una sotto cartella:

```nginx
location ~ ^/verdaccio/(.*)$ {
    proxy_pass http://127.0.0.1:4873/$1;
    proxy_set_header Host            $host:$server_port;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

In questo caso invece, `url_prefix` dovrebbe essere impostato su `/verdaccio/`

> Note: There is a Slash after install path (`https://your-domain:port/verdaccio/`)!