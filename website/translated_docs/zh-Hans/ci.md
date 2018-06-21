---
id: 词
title: "连续集成"
---
您可以在登录或发布时使用 verdaccio 进行连续集成。 什么时候 使用NPM在持续集成环境中安装私有模块 这是第一次，一堵砖墙很快被击中。 NPM 登录命令设计为交互式使用。 这会导致 CI、脚本等问题。 下面是如何使用 NPM 登录不同的连续集成平台的方法。

- [特拉维斯 CI](https://remysharp.com/2015/10/26/using-travis-with-private-npm-deps)
- [圆圈 CI 1.0](https://circleci.com/docs/1.0/npm-login/) 或 [圆圈 CI 2.0](https://circleci.com/docs/2.0/deployment-integrations/#npm)
- [Gitlab 词](https://www.exclamationlabs.com/blog/continuous-deployment-to-npm-using-gitlab-ci/)