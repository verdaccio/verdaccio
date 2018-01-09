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
                        <img src="https://img.shields.io/npm/v/verdaccio.svg" alt="npm 版本徽章">
                </a>
        </span>
        <span>
                <a href="https://www.npmjs.org/package/verdaccio">
                        <img src="https://camo.githubusercontent.com/81e53cc0a99c3ae97709fa66232a5807c346c61e/687474703a2f2f696d672e736869656c64732e696f2f6e706d2f646d2f76657264616363696f2e737667" alt="下载数量徽章" data-canonical-src="http://img.shields.io/npm/dm/verdaccio.svg" style="max-width:100%;">
                </a>
        </span>
</div>

<div class="link-section">
        <a href="https://github.com/verdaccio" title="Github verdaccio page">GitHub</a>
        <a href="https://github.com/verdaccio/verdaccio/tree/master/wiki" title="Documentation">文档</a>
</div>


</div> 

## 快速上手

一条命令即可完成安装

```sh
$> npm install --global verdaccio

# or

$> yarn global add verdaccio

```

## 易于设置

将 npm 默认仓库指向为你的 Verdaccio 实例

```sh
<br />$> npm set registry http://localhost:4873

$> npm adduser --registry http://localhost:4873

```

## 易于使用

在命令行终端中执行

```sh
<br />$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:4873/ - verdaccio/2.2.0

```

#### 就这么简单! 开始使用你的 **私有 npm 仓库吧**。

##### 支持所有主流的 npm 客户端

<div class="client-support">
    <div class="client">
        <img src="css/icon/npm-logo.svg" alt="Docker 支持" width="200"/>
    </div>
    <div class="client">
        <img src="css/icon/yarn-logo.svg" alt="Docker 支持" width="200"/>
    </div>
</div>

<div class="section">
    <h1>
        Docker Ready
    </h1>
    <a href="https://github.com/verdaccio/verdaccio/blob/master/wiki/docker.md" target="_blank">
        <img src="css/icon/docker.jpeg" alt="Docker 支持" width="200"/>
    </a>
</div>
