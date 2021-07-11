---
id: ssl
title: "Настройка SSL-сертификатов"
---

Follow these instructions to configure an SSL certificate to serve an npm registry over HTTPS.

* Обновите свойство `listen` в вашем `~/.config/verdaccio/config.yaml`:

    listen: 'https://your.domain.com/'
    

Когда вы обновите свойство listen и попытаетесь запустить verdaccio снова, он запросит сертификаты.

* Сгенерируйте ваши сертификаты

     $ openssl genrsa -out /Users/user/.config/verdaccio/verdaccio-key.pem 2048
     $ openssl req -new -sha256 -key /Users/user/.config/verdaccio/verdaccio-key.pem -out /Users/user/.config/verdaccio/verdaccio-csr.pem
     $ openssl x509 -req -in /Users/user/.config/verdaccio/verdaccio-csr.pem -signkey /Users/user/.config/verdaccio/verdaccio-key.pem -out /Users/user/.config/verdaccio/verdaccio-cert.pem
     ````
    
    * Отредактируйте конфигурационный файл `/Users/user/.config/verdaccio/config.yaml` и добавьте следующую секцию:
    
    

https: key: /Users/user/.config/verdaccio/verdaccio-key.pem cert: /Users/user/.config/verdaccio/verdaccio-cert.pem ca: /Users/user/.config/verdaccio/verdaccio-csr.pem

    <br />Или, если у вас сертификат в формате `server.pfx`, вы можете добавить следущую секцию в конфиг: (Аргумент passphrase - не обязательный, и нужен только когда ваш сертификат зашифрован.)
    
    

https: pfx: /Users/user/.config/verdaccio/server.pfx passphrase: 'secret' ````

Больше информации про аргументы `key`, `cert`, `ca`, `pfx` и `passphrase` вы найдете в [Node documentation](https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options)

* Запустите `verdaccio` в командной строке.

* Откройте браузер и загрузите `https://your.domain.com:port/`

Инструкция выше писалась для OSX и Linux, на Windows пути немного отличаются, но шаги - те же самые.

## Docker

Если вы используете Docker-образ, вам нужно установить переменную окружения `VERDACCIO_PROTOCOL` в значение `https`, так как свойство `listen` придёт из файла [Dockerfile](https://github.com/verdaccio/verdaccio/blob/master/Dockerfile#L43) и будет проигнорировано в вашем конфигурационном файле.

Так же, вы можете установить переменную окружения `VERDACCIO_PORT`, если используете порт, отличный от `4873`.