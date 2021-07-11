---
id: windows
title: "Инсталирајте као Windows Service"
---

Угрубо базирано на упутствима која се могу пронаћи [овде](http://asysadmin.tumblr.com/post/32941224574/running-nginx-on-windows-as-a-service). Направили смо пример verdaccio servis инсталације која ради као сат. Швајцарски:

1. Креирајте директоријум за verdaccio 
    * mkdir `c:\verdaccio`
    * cd `c:\verdaccio`
2. Инсталирајте verdaccio локално (догађају се проблеми са npm ако је инсталација глобална) 
    * npm install verdaccio
3. Креирајте свој `config.yaml` фајл на овој локацији `(c:\verdaccio\config.yaml)`
4. Windows Service Setup

<div id="codefund">''</div>

## Коришћење NSSM

АЛТЕРНАТИВНИ МЕТОД: (WinSW пакет је недостајао када је један од наших сарадника покушао да га преузме)

* Преузмите [NSSM](https://www.nssm.cc/download/) и екстракујте

* Додајте путању до nssm.exe у PATH

* Отворите administrative command

* Покрените nssm install verdaccio. Као минимум, морате попунити поља: Application tab Path, Startup directory и Arguments. Ако претпоставимо да сте инсталирали са node у system path на локацију c:\verdaccio требало би да функционише:
    
    * Path: `node`
    * Startup directory: `c:\verdaccio`
    * Arguments: `c:\verdaccio\node_modules\verdaccio\build\lib\cli.js -c c:\verdaccio\config.yaml`
    
    Можете да подесите друга сервисна подешавања у оквиру осталих табова по сопственим жељама. Када завршите, кликните дугме Install service
    
    * Покрените service sc, покрените verdaccio

## Коришћење WinSW

* Од 2015-10-27, WinSW више није доступан на наведеној локацији. Пратите инструкције дате у Using NSSM.
* Преузмите [WinSW](http://repo.jenkins-ci.org/releases/com/sun/winsw/winsw/) 
    * Поставите exe (пример, `winsw-1.9-bin.exe`) у овај фолдер (`c:\verdaccio`) и преименујте у `verdaccio-winsw.exe`
* Направите фајл за конфигурисање `c:\verdaccio`, назван `verdaccio-winsw.xml` са следећом конфигурацијом `xml verdaccio verdaccio verdaccio node c:\verdaccio\node_modules\verdaccio\src\lib\cli.js -c c:\verdaccio\config.yaml roll c:\verdaccio`.
* Инсталирајте сервис 
    * `cd c:\verdaccio`
    * `verdaccio-winsw.exe install`
* Покрените сервис 
    * `verdaccio-winsw.exe start`

Изгледа да су неки од config компликованији него што смо очекивали, изгледа да се 'working directory' игнорише, али радуцка и поред тога. Тако verdaccio инстанца опстаје између рестартовања сервера, и сама себе ресетује у случају пада неког процеса везаног за verdaccio.

## Репозиторијуми

* [verdaccio-deamon-windows](https://github.com/davidenke/verdaccio-deamon-windows)