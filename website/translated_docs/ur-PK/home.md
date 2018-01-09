---
id: home
title: Verdaccio npm proxy private registry
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
                        <img src="https://img.shields.io/npm/v/verdaccio.svg" alt="npm version badge">
                </a>
        </span>
        <span>
                <a href="https://www.npmjs.org/package/verdaccio">
                        <img src="https://camo.githubusercontent.com/81e53cc0a99c3ae97709fa66232a5807c346c61e/687474703a2f2f696d672e736869656c64732e696f2f6e706d2f646d2f76657264616363696f2e737667" alt="downloads badge" data-canonical-src="http://img.shields.io/npm/dm/verdaccio.svg" style="max-width:100%;">
                </a>
        </span>
</div>

<div class="link-section">
        <a href="https://github.com/verdaccio" title="Github verdaccio page">GitHub</a>
        <a href="https://github.com/verdaccio/verdaccio/tree/master/wiki" title="Documentation">Documentation</a>
</div>


</div> 

## Easy to Install

One single command to install the application

```sh
$> npm install --global verdaccio

# or

$> yarn global add verdaccio

```

## Easy to Set Up

Set your verdaccio registry as default

```sh
<br />$> npm set registry http://localhost:4873

$> npm adduser --registry http://localhost:4873

```

## Easy to Use

Run it in your terminal

```sh
<br />$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:5555/ - verdaccio/2.2.0

```

#### That's it ! Enjoy your **private package manager**.

##### and all the most popular npm clients are supported.

<div class="client-support">
    <div class="client">
        <img src="css/icon/npm-logo.svg" alt="Docker Support" width="200"/>
    </div>
    <div class="client">
        <img src="css/icon/yarn-logo.svg" alt="Docker Support" width="200"/>
    </div>
</div>

<div class="section">
    <h1>
        Docker Ready
    </h1>
    <a href="https://github.com/verdaccio/verdaccio/blob/master/wiki/docker.md" target="_blank">
        <img src="css/icon/docker.jpeg" alt="Docker Support" width="200"/>
    </a>
</div>
