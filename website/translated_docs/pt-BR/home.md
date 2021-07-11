---
id: home
title: "Verdaccio registro privado e proxy npm"
---


<div class="top-section-home">
    <div class="logo-section"></div>

<div class="title-section">
    site.title
</div>

<div class="subtitle-section">
    site.description
</div>

<div class="badges">
        <span>
                <a href="https://github.com/verdaccio/verdaccio">
                        <img src="https://img.shields.io/github/stars/verdaccio/verdaccio.svg?style=social&label=Star&maxAge=3600" style="max-width:100%;">
                </a>
        </span>
        <span>
                <a href="https://www.npmjs.org/package/verdaccio">
                        <img src="https://img.shields.io/npm/v/verdaccio.svg" alt="badge versão npm">
                </a>
        </span>
        <span>
                <a href="https://www.npmjs.org/package/verdaccio">
                        <img src="https://camo.githubusercontent.com/81e53cc0a99c3ae97709fa66232a5807c346c61e/687474703a2f2f696d672e736869656c64732e696f2f6e706d2f646d2f76657264616363696f2e737667" alt="downloads badge" data-canonical-src="http://img.shields.io/npm/dm/verdaccio.svg" style="max-width:100%;">
                </a>
        </span>
</div>

<div class="link-section">
  <a href="https://github.com/verdaccio" title="Projeto Verdaccio">GitHub</a> <a href="https://github.com/verdaccio/verdaccio/tree/master/wiki" title="Documentação">Documentação</a>
</div></div> 

## Fácil de Instalar

Instale seu novo registro com um único comando

```sh
$> npm install --global verdaccio

# or

$> yarn global add verdaccio

```

## Fácil de Configurar

Configure o seu novo registro verdaccio como padrão

```sh
<br />$> npm set registry http://localhost:4873

$> npm adduser --registry http://localhost:4873

```

## Fácil de Usar

Use a partir do seu terminal

```sh
<br />$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:5555/ - verdaccio/2.2.0

```

#### Tudo pronto! Aproveite o seu novo **gerente de pacotes privado**.

##### a maioria dos clientes npm é suportada.

<div class="client-support">
    <div class="client">
        <img src="css/icon/npm-logo.svg" alt="Suporte Docker" width="200"/>
    </div>
    <div class="client">
        <img src="css/icon/yarn-logo.svg" alt="Suporte Docker" width="200"/>
    </div>
</div>

<div class="section">
    <h1>
        Pronto para Docker
    </h1>
    <a href="https://github.com/verdaccio/verdaccio/blob/master/wiki/docker.md" target="_blank">
        <img src="css/icon/docker.jpeg" alt="Suporte Docker" width="200"/>
    </a>
</div>
