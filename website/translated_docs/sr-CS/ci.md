---
id: ci
title: "Continuous Integration"
---
Možete koristiti verdaccio sa continuous integration dok vršite login ili publikovanje. Kada po prvi put koristite NPM kako biste instalirali private module u continuous integration okruženje, udarićete glavom u zid. Komanda za NPM login je dizajnirana tako da se koristi na interaktivan način. To pravi probleme u CI, scripts, i čemu sve ne. Evo kako bi trebalo da koristite NPM login za različite continuous integration platforme.

- [Travis CI](https://remysharp.com/2015/10/26/using-travis-with-private-npm-deps)
- [Circle CI 1.0](https://circleci.com/docs/1.0/npm-login/) or [Circle CI 2.0](https://circleci.com/docs/2.0/deployment-integrations/#npm)
- [Gitlab CI](https://www.exclamationlabs.com/blog/continuous-deployment-to-npm-using-gitlab-ci/)