---
id: ci
title: "持续集成"
---
在登陆或发布的时候，您可以用verdaccio 进行持续集成。 初次使用NPM在持续集成的环境里安装专用模块，可能会马上碰到问题。 NPM 登陆命令设计为交互式使用。 它导致CI，脚本等问题。 下面是如何使用NPM 登陆不同持续集成平台的方法。

- [Travis CI](https://remysharp.com/2015/10/26/using-travis-with-private-npm-deps)
- [Circle CI 1.0](https://circleci.com/docs/1.0/npm-login/) 或者[Circle CI 2.0](https://circleci.com/docs/2.0/deployment-integrations/#npm)
- [Gitlab CI](https://www.exclamationlabs.com/blog/continuous-deployment-to-npm-using-gitlab-ci/)