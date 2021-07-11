---
id: what-is-verdaccio
title: "Veridaccio とは？"
---

Verdaccioは、**Node.js**で構築された**軽量なプライベートnpmプロキシレジストリ**です。 <iframe width="560" height="315" src="https://www.youtube.com/embed/hDIFKzmoCaA?enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen mark="crwd-mark"></iframe> 

## What's a registry?

* A registry is a repository for packages, that implements the **CommonJS Compliant Package Registry specification** for reading package's information.
* Provide a compatible API with npm clients **(yarn/npm/pnpm)**.
* Semantic Versioning compatible **(semver)**.

    $> verdaccio
    

![レジストリ](assets/verdaccio_server.gif)

## Verdaccioの使用方法

Using Verdaccio with any Node.js package manager client is quite straightforward.

![レジストリ](assets/npm_install.gif)

You can use a custom registry either by setting it globally for all your projects

    npm set registry http://localhost:4873
    

or by using it in command line as an argument `--registry` in npm (slightly different in yarn)

    npm install lodash --registry http://localhost:4873
    

    yarn config set registry http://localhost:4873
    

## プライベート

Verdaccioにpublishしたパッケージはすべて非公開で、アクセスできるのは設定に基づくクライアントだけです。

## プロキシ

Verdaccio cache all dependencies on demand and speed up installations in local or private networks.

## In a Nutshell

* Node.js上で動作するWebアプリ
* プライベートnpmレジストリ
* ローカルネットワークプロキシ
* プラグイン対応のアプリケーション
* It's fairly easy to install and to use
* DockerとKubernetesのサポートを提供しています
* yarn、npm、pnpmと100％互換性があります
* Verdaccio means **A green color popular in late medieval Italy for fresco painting**.