---
id: ci
title: "Tích hợp liên tục"
---
Khi đăng nhập hoặc công khai các mã code của mình, bạn có thể sử dụng verdaccio bằng phương pháp tích hợp liên tục. Có thể bạn sẽ gặp sự cố ngay lập tức vào lần đầu tiên sử dụng NPM để chạy mô-đun chuyên dụng trong môi trường tích hợp liên tục. Lệnh đăng nhập NPM được tạo ra để tạo ra tính tương tác lẫn nhau khi sử dụng. Điều này có thể gây ra sự cố trong CI, tập lệnh, v. v. Dưới đây là cách sử dụng NPM để đăng nhập vào các nền tảng tích hợp liên tục khác nhau.

- [Travis CI](https://remysharp.com/2015/10/26/using-travis-with-private-npm-deps)
- [Circle CI 1.0](https://circleci.com/docs/1.0/npm-login/) or [Circle CI 2.0](https://circleci.com/docs/2.0/deployment-integrations/#npm)
- [Gitlab CI](https://www.exclamationlabs.com/blog/continuous-deployment-to-npm-using-gitlab-ci/)