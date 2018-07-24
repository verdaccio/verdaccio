---
id: ssl
title: "设置SSL 证书"
---
依照这些说明来配置SSL 证书来服务HTTPS 下的NPM registry。

* 在`~/.config/verdaccio/config.yaml`更新监听属性：

    listen: 'https://your.domain.com/'
    

一旦更新监听，并试着再次运行verdaccio ，将会被要求使用证书。

* 生成证书

     $ openssl genrsa -out /Users/user/.config/verdaccio/verdaccio-key.pem 2048
     $ openssl req -new -sha256 -key /Users/user/.config/verdaccio/verdaccio-key.pem -out /Users/user/.config/verdaccio/verdaccio-csr.pem
     $ openssl x509 -req -in /Users/user/.config/verdaccio/verdaccio-csr.pem -signkey /Users/user/.config/verdaccio/verdaccio-key.pem -out /Users/user/.config/verdaccio/verdaccio-cert.pem
     ````
    
    * 编辑 config file `/Users/user/.config/verdaccio/config.yaml`并添加以下部分
    
    

https: key: /Users/user/.config/verdaccio/verdaccio-key.pem cert: /Users/user/.config/verdaccio/verdaccio-cert.pem ca: /Users/user/.config/verdaccio/verdaccio-csr.pem

    <br />或者，如果证书是server.pfx`格式，您可以添加以下配置部分。如果证书已加密，密码则是可选以及仅当需要时。
    
    

https: pfx: /Users/user/.config/verdaccio/server.pfx passphrase: 'secret' ````

更多 关于`key`, `cert`, `ca`, `pfx` 和`passphrase` 参数信息，请参照 [节点文档](https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options)

* 在命令行运行`verdaccio`。

* 打开浏览器，并加载`https://your.domain.com:port/`

此指南仅在OSX和 Linux里有效，在 Windows 里，路径将不同，但步骤是一样的。

## Docker

If you are using the Docker image, you have to set the `PROTOCOL` environment variable to `https` as the `listen` argument is provided on the [Dockerfile](https://github.com/verdaccio/verdaccio/blob/master/Dockerfile#L43), and thus ignored from your config file.

You can also set the `PORT` environment variable if you are using a different port than `4873`.