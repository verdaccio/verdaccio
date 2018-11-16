---
id: installation
title: "Installation"
---
Verdaccio est une application Web multi-plateforme. Quelques conditions préalables sont requises pour son installation.

#### Conditions préalables

1. Nœud supérieur à 
    - Pour la version `verdaccio@2.x` Noeud `v4.6.1` est la version minimale prise en charge.
    - Pour la version `verdaccio@latest` Noeud `6.12.0` est la version minimale prise en charge.
2. npm `>=3.x` ou `yarn`
3. L'interface web prend en charge les navigateurs `Chrome, Firefox, Edge, et IE9`.

## En cours d'installation du CLI

`verdaccio` doit être installé globalement en utilisant l'une des méthodes suivantes:

En utilisant `npm`

```bash
npm install -g verdaccio
```

ou en utilisant `yarn`

```bash
yarn global add verdaccio
```

![installer verdaccio](/svg/install_verdaccio.gif)

## Usage basique

Une fois installé, il vous suffit d’exécuter la commande CLI:

```bash
$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:4873/ - verdaccio/3.0.1
```

Pour plus d'information sur CLI, veuillez [lire la section cli](cli.md).

## Image de docker

`verdaccio` a une image de docker officielle que vous pouvez utiliser, et dans la majorité des cas, la configuration par défaut est assez bonne. Pour plus d’informations sur la façon d’installer l’image officielle, [lisez la section docker](docker.md).

## Cloudron

`verdaccio` est également disponible en application à installer en 1 clic sur [Cloudron](https://cloudron.io)

[![Installer](https://cloudron.io/img/button.svg)](https://cloudron.io/button.html?app=org.eggertsson.verdaccio)