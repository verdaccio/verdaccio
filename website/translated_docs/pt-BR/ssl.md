---
id: ssl
title: "Configurar SSL"
---

Follow these instructions to configure an SSL certificate to serve an npm registry over HTTPS.

* Atualize a propriedade listen no seu `~/.config/verdaccio/config.yaml`:

    listen: 'https://your.domain.com/'
    

Depois de atualizar a propriedade listen e tentar executar o verdaccio novamente, ele solicitará certificados.

* Gere seus certificados

     $ openssl genrsa -out /Users/user/.config/verdaccio/verdaccio-key.pem 2048
     $ openssl req -new -sha256 -key /Users/user/.config/verdaccio/verdaccio-key.pem -out /Users/user/.config/verdaccio/verdaccio-csr.pem
     $ openssl x509 -req -in /Users/user/.config/verdaccio/verdaccio-csr.pem -signkey /Users/user/.config/verdaccio/verdaccio-key.pem -out /Users/user/.config/verdaccio/verdaccio-cert.pem
     ````
    
    * Edite o seu arquivo config `/Users/user/.config/verdaccio/config.yaml` e adicione a seguinte seção:
    
    

https: key: /Users/user/.config/verdaccio/verdaccio-key.pem cert: /Users/user/.config/verdaccio/verdaccio-cert.pem ca: /Users/user/.config/verdaccio/verdaccio-csr.pem

    <br />Como alternativa, se você tiver um certificado no formato `server.pfx`, você poderá adicionar a seguinte seção de configuração: (A senha é opcional e necessária apenas se o certificado for criptografado.)
    
    

https: pfx: /Users/user/.config/verdaccio/server.pfx passphrase: 'secret' ````

Você pode encontrar mais informações nos argumentos `key`, `cert`, `ca`, `pfx`, e `passphrase` contidos na [documentação do Node](https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options)

* Execute o `verdaccio` na sua linha de comando.

* Abra o navegador e visite o endereço `https://your.domain.com:port/`

Essas instruções são válidas principalmente para OSX e Linux; no Windows, os caminhos variam, mas os passos são os mesmos.

## Docker

Se você estiver usando a imagem do Docker, você terá que configurar a variável de ambiente `VERDACCIO_PROTOCOL` para `https`, já que o argumento `listen` é fornecido no [Dockerfile](https://github.com/verdaccio/verdaccio/blob/master/Dockerfile#L43) e, portanto, ignorado do seu arquivo de configuração.

Você também pode definir a variável de ambiente `VERDACCIO_PORT` se estiver usando uma porta diferente de `4873`.