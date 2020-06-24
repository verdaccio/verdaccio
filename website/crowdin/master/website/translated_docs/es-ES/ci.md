---
id: ci
title: "Integración Continua"
---

Verdaccio puede ser usado en plataformas de integración continua (CI) para instalar o publicar paquetes. Si se utiliza NPM para instalar un paquete privado en un entorno de CI por primera vez, puedes encontrarte con algunos problemas. El comando `npm login` está diseñado para se usado interactivamente. Esto ocasiona un problema en CI, scripts, etc. Debajo hay algunos artículos detallando cómo usar `npm login` en diferentes plataformas de CI.

- [Travis CI](https://remysharp.com/2015/10/26/using-travis-with-private-npm-deps)
- [Circle CI 1.0](https://circleci.com/docs/1.0/npm-login/) ó [Circle CI 2.0](https://circleci.com/docs/2.0/deployment-integrations/#npm)
- [Gitlab CI](https://www.exclamationlabs.com/blog/continuous-deployment-to-npm-using-gitlab-ci/)