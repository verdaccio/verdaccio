---
id: ci
title: "Tích hợp liên tục"
---
Khi đăng nhập hoặc công khai các mã code của mình, bạn có thể sử dụng verdaccio bằng phương pháp tích hợp liên tục. Lần đầu tiên bạn sử dụng NPM để chạy mô-đun chuyên dụng trong môi trường tích hợp liên tục, có thể bạn sẽ gặp sự cố ngay lập tức. The NPM login command is designed to be used interactively. This causes an issue in CI, scripts, etc. Here’s how to use NPM login different continuous integration platforms.

- [Travis CI](https://remysharp.com/2015/10/26/using-travis-with-private-npm-deps)
- [Circle CI 1.0](https://circleci.com/docs/1.0/npm-login/) or [Circle CI 2.0](https://circleci.com/docs/2.0/deployment-integrations/#npm)
- [Gitlab CI](https://www.exclamationlabs.com/blog/continuous-deployment-to-npm-using-gitlab-ci/)