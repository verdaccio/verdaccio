# Reverse Proxy Setup

## Apache

Apache and mod_proxy should not decode/encode slashes and leave them as they are:

````
<VirtualHost *:80>
  AllowEncodedSlashes NoDecode
  ProxyPass /npm http://127.0.0.1:4873 nocanon
  ProxyPassReverse /npm http://127.0.0.1:4873
</VirtualHost>
````

## Nginx 

````
server {
  listen 80 default_server;
  location / {
    proxy_pass              http://127.0.0.1:4873/;
    proxy_set_header        Host $host;
  }
}
```
