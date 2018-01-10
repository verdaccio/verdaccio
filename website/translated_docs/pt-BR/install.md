---
id: installation
title: Instalação
---
Verdaccio is a multiplatform web application, to install you need at least some prerequisites.

#### Pré-requisitos

1. Node, acima da versão 
    - Para a versão *2.x* é suportado node a partir **4.6.1**
    - Para a versão *3.x* é suportado node a partir **6.12.0**
2. npm *>=3.x* ou yarn

## Instação

`Verdaccio` must be install globaly using any of the most modern

Usando `npm`

```bash
npm install -g verdaccio
```

ou usando `yarn`

```bash
yarn global add verdaccio
```

> Warning: Verdaccio current is not support PM2's cluster mode, run it with cluster mode may cause unknown behavior

## Como Usar

Assim que instalado, você só precisa executar um único comando na linha de comando.

```bash
$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:5555/ - verdaccio/3.0.0
```

![](https://cdn-images-1.medium.com/max/720/1*jDHnZ7_68u5s1lFK2cygnA.gif)

Para mais informações sobre a Linha de Comando, por favor [leia a seção sobre Linha de Comando](cli.md).

## Imagem do Docker

`verdaccio` já possui uma imagem para o Docker oficial, na maioria dos casos a configuração padrão já é suficiente. Para mais informações sobre como instalar a imagem oficial, visite a [seção do Docker](docker.md).