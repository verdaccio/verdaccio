---
id: installation
title: Instalação
---
Verdaccio is a multiplatform web application, to install you need at least some prerequisites.

#### Pré-requisitos

1. Node, acima da versão 
    - For version `verdaccio@2.x` we support from Node `v4.6.1`.
    - For version `verdaccio@3.x` we support as minimum Node `6.12.0`
2. npm `>=3.x` or `yarn`
3. The web interface support browsers `Chrome, Firefox, Edge, and IE9`

## Instação

`verdaccio` must be install globaly using any of the most modern

Usando `npm`

```bash
npm install -g verdaccio
```

ou usando `yarn`

```bash
yarn global add verdaccio
```

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