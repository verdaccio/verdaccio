---
id: installation
title: "Установка"
---
Verdaccio — мультиплатформенное веб-приложение. Чтобы его установить, вам потребуется обеспечить некоторые условия.

#### Требования

1. Node выше чем 
    - Для `verdaccio@2.x` Node `v4.6.1` минимальная допустимая версия.
    - Для `verdaccio@latest` Node `6.12.0` минимальная допустимая версия.
2. npm `>=3.x` или `yarn`
3. Обозреватели, поддерживающие веб-интерфейс, `Chrome, Firefox, Edge, and IE9`.

## Установка инструмента командной строки

`verdaccio` должен быть установлено глобально используя один из следующих способов:

С использованием `npm`

```bash
npm install -g verdaccio
```

или с использованием `yarn`

```bash
yarn global add verdaccio
```

![установка verdaccio](/svg/install_verdaccio.gif)

## Запуск

После того как установка завершится, всё что вам нужно, это выполнить команду:

```bash
$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:4873/ - verdaccio/3.0.1
```

Больше информации об инструментах командной строки [читайте в этом разделе](cli.md).

## Docker образ

`verdaccio` имеет официальный образ Docker, который вы можете использовать, и в большенстве случаем стандартная конфигурация отлично работает. Больше информации о том как установить официальный образ [читайте в этом разделе](docker.md).

## Cloudron

`verdaccio` так же доступен для устновку в один клик с [Cloudron](https://cloudron.io)

[![Установка](https://cloudron.io/img/button.svg)](https://cloudron.io/button.html?app=org.eggertsson.verdaccio)