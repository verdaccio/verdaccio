---
id: ci
title: "Integração Contínua"
---

O Verdaccio pode ser usado com plataformas de integração contínua (CI) para instalar ou publicar pacotes. Ao usar o NPM para instalar um pacote privado em um ambiente de IC pela primeira vez, você poderá esbarrar em alguns problemas. O comando `npm login` é projetado para ser usado interativamente. Isso representa um problema no CI, scripts, etc. Abaixo estão alguns artigos detalhando como usar o `npm login` em diferentes plataformas de CI.

- [Travis CI](https://remysharp.com/2015/10/26/using-travis-with-private-npm-deps)
- [Circle CI 1.0](https://circleci.com/docs/1.0/npm-login/) ou [Circle CI 2.0](https://circleci.com/docs/2.0/deployment-integrations/#npm)
- [Gitlab CI](https://www.exclamationlabs.com/blog/continuous-deployment-to-npm-using-gitlab-ci/)