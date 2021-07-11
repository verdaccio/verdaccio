---
id: ci
title: "Integrazione continua"
---

Verdaccio può essere utilizzato con piattaforme di integrazione continua (CI) per installare o pubblicare pacchetti. Quando si utilizza NPM per installare un pacchetto privato in un ambiente di CI per la prima volta, si potrebbe incorrere in alcuni problemi. Il comando `npm login` è progettato per essere utilizzato in modo interattivo. Questo crea un problema in CI, negli script, ecc. Di seguito sono disponibili alcuni articoli che spiegano dettagliatamente come utilizzare `npm login` su differenti piattaforme di CI.

- [Travis CI](https://remysharp.com/2015/10/26/using-travis-with-private-npm-deps)
- [Circle CI 1.0](https://circleci.com/docs/1.0/npm-login/) or [Circle CI 2.0](https://circleci.com/docs/2.0/deployment-integrations/#npm)
- [Gitlab CI](https://www.exclamationlabs.com/blog/continuous-deployment-to-npm-using-gitlab-ci/)