---
id: installazione
title: "Installazione"
---
Verdaccio è un'applicazione web multi piattaforma. Per la sua installazione sono necessari pochi prerequisiti.

#### Prerequisiti

1. Nodo maggiore di 
    - Per la versione `verdaccio@2.x` Node `v4.6.1` è la versione minima supportata.
    - Per la versione `verdaccio@latest` Node `6.12.0` è la versione minima supportata.
2. npm `>=3.x` or `yarn`
3. L'interfaccia web supporta i browser `Chrome, Firefox, Edge, and IE9`.

## Installazione di CLI

`verdaccio` deve essere installato globalmente utilizzando uno dei seguenti metodi:

Usando `npm`

```bash
npm install -g verdaccio
```

o usando `yarn`

```bash
yarn global add verdaccio
```

![installare verdaccio](/svg/install_verdaccio.gif)

## Utilizzo di base

Una volta che è stato installato, è necessario solamente eseguire il comando CLI:

```bash
$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:4873/ - verdaccio/3.0.1
```

Per ulteriori informazioni riguardo a CLI, si prega di [leggere la sezione cli](cli.md).

## Immagine Docker

`verdaccio` ha un'immagine docker ufficiale disponibile da utilizzare, ed in molti casi, la configurazione predefinita è sufficientemente buona. Per ulteriori informazioni su come installare l'immagine ufficiale, [leggere la sezione docker](docker.md).

## Cloudron

`verdaccio` è anche disponibile come applicazione da installare in 1 click su [Cloudron](https://cloudron.io)

[![Installazione](https://cloudron.io/img/button.svg)](https://cloudron.io/button.html?app=org.eggertsson.verdaccio)