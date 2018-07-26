---
id: reverse-proxy（逆向代理服务器）
title: "逆向代理服务器设置"
---
## Apache

不要在Apache 和mod_proxy 解码/编码slashes（斜线），要让它们保持不变:

    <VirtualHost *:80>
      AllowEncodedSlashes NoDecode
      ProxyPass /npm http://127.0.0.1:4873 nocanon
      ProxyPassReverse /npm http://127.0.0.1:4873
    </VirtualHost>
    

### 用SSL 配置

config.yaml

```yaml
url_prefix: https://npm.your.domain.com
```

Apache 虚拟服务器配置

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
    

## 在逆向代理服务器后运行用不同的域名和端口

如果您在逆向代理服务器后运行verdaccio，您可能会注意到所有源文件都起到相关路径的作用，如 `http://127.0.0.1:4873/-/static`

要解决这个问题，您应该用 `Host`heade发送实际域名和端口到 verdaccio。

Nginx configure应该如下所示：

```nginx
ocation / {
    proxy_pass http://127.0.0.1:4873/;
    proxy_set_header Host            $host:$server_port;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

在这个例子里，verdaccio config里不应该设置`url_prefix`

* * *

或者子-目录安装：

```nginx
location ~ ^/verdaccio/(.*)$ {
    proxy_pass http://127.0.0.1:4873/$1;
    proxy_set_header Host            $host:$server_port;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

在这个例子里， `url_prefix` 应该设置为`/verdaccio/`

> 请注意: 在安装路径 (`https://your-domain:port/vardaccio/`)后有一条斜线!