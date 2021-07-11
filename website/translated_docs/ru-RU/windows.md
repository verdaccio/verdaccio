---
id: windows
title: "Установка в качестве службы Windows"
---

Основано на инструкции, найденной [здесь](http://asysadmin.tumblr.com/post/32941224574/running-nginx-on-windows-as-a-service). Я сделал следующее и получил полностью функциональный сервис verdaccio:

1. Создайте папку для verdaccio
    * mkdir `c:\verdaccio`
    * cd `c:\verdaccio`
2. Установите verdaccio локально (у меня были проблемы при глобальной установке)
    * npm install verdaccio
3. Создайте свой `config.yaml` в этой папке `(c:\verdaccio\config.yaml)`
4. Сконфигурируйте сервис Windows

## С помощью NSSM

АЛЬТЕРНАТИВНЫЙ МЕТОД: (пакета WinSW не было, когда я попытася скачать его)

* Скачайте [NSSM](https://www.nssm.cc/download/) и распакуйте его

* Добавьте путь к nssm.exe в PATH

* Откройте окно командной строки как администратор

* Запустите `nssm install verdaccio`. Как минимум, вы должны заполнить Path на вкладке Application, Startup directory и поле Arguments. Предполагая, что вы указали путь к Node в системных путях и что вы установили verdaccio в папку c:\verdaccio, можно использовать следующие значения:
    * Path: `node`
    * Startup directory: `c:\verdaccio`
    * Arguments: `c:\verdaccio\node_modules\verdaccio\build\lib\cli.js -c c:\verdaccio\config.yaml`

    Вы можете поменять настройки других сервисов в других вкладках, если хотите. Когда вы закончите, нажмите кнопку Install service

 * Запустите сервис sc start verdaccio

## С помощью WinSW

* На 2015-10-27, WinSW больше нет по указанному адресу. Пожалуйста, используйте инструкции под заголовком "С помощью NSSM" выше.
* Скачайте [WinSW](http://repo.jenkins-ci.org/releases/com/sun/winsw/winsw/)
    * Поместите исполняемый файл (т.е. `winsw-1.9-bin.exe`) в папку (`c:\verdaccio`) и переименуйте его в `verdaccio-winsw.exe`
* Создайте конфигурационнный файл в `c:\verdaccio`, назвав его `verdaccio-winsw.xml`, со следующей конфигурацией `xml verdaccio verdaccio verdaccio node c:\verdaccio\node_modules\verdaccio\src\lib\cli.js -c c:\verdaccio\config.yaml roll c:\verdaccio`.
* Инсталлируйте ваш сервис
    * `cd c:\verdaccio`
    * `verdaccio-winsw.exe install`
* Запустите ваш сервис
    * `verdaccio-winsw.exe start`

Указанные выше конфиги оказались слежнее, чем я ожидал - например, 'workingdirectory' был проигнорирован, но, тем не менее, это заработало, и позволило моему verdaccio оставаться запущенным после перезапуска сервера, и так же рестартовать в случае крэша verdaccio.


## Ссылки

* [verdaccio-deamon-windows](https://github.com/davidenke/verdaccio-deamon-windows)
