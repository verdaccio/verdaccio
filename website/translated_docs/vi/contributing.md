---
id: đóng góp
title: "Tham gia đóng góp Verdaccio"
---
First of all Để có thể sử dụng một cơ sở mã hoàn toàn mới là điều không hề dễ dàng, vì vậy chúng tôi luôn sẵn sàng giúp đỡ bạn.

## Kênh trao đổi

Nếu bạn có bất cứ câu hỏi nào, xin hãy gửi cho chúng tôi qua hai kênh sau để chúng ta cùng thảo luận:

* [Kênh Discord công khai](http://chat.verdaccio.org/)

## Bắt đầu

Thoạt nhìn, verdaccio chỉ là một kho lưu trữ đơn giản, nhưng bên trong lại có nhiều cách khác nhau để bạn có thể đóng góp và một loạt các công nghệ để bạn thực hành.

### Tìm vị trí phù hợp với tôi

Mỗi người đều có các kỹ năng khác nhau, vì vậy hãy xem và cảm nhận nơi bạn thấy thoải mái nhất để có thể sử dụng kỹ năng của mình.

### Tôi biết hoặc tôi muốn tìm hiểu về Node.js

Node.js là một hệ thống phần mềm dựa trên `verdaccio`, chúng tôi sử dụng `express`, `commander `, `request` hoặc `async ` làm thư viện của chương trình. Về cơ bản, Verdaccio là một Rest API, giống như `yarn`, tạo ra giao tiếp tương thích với máy khách `npm`.

Chúng tôi có rất nhiều [danh sách plugin](plugins.md) có sẵn và được cải thiện, nhưng đồng thời [bạn cũng có thể tạo plugin của riêng mình](dev-plugins.md).

### Tôi thích làm việc trong giao diện người dùng hơn

Thời gian gần đây, chúng tôi đã chuyển sang các công nghệ hiện đại như `React` và `element-react`. Chúng tôi mong được biết đến những ý tưởng mới về cách cải thiện giao diện người dùng.

### Việc nâng cấp ngăn xếp sẽ giúp tôi cảm thấy thoải mái hơn

Tất nhiên, chúng tôi sẽ vui lòng giúp bạn cải thiện ngăn xếp và bạn có thể nâng cấp các dependency của mình lên `eslint `, `stylelint`, `webpack`. Bạn có thể nâng cấp cấu hình `webpack` cũng rất tuyệt. Chúng tôi hoan nghênh mọi ý kiến đóng góp của các bạn. Ngoài ra, nếu bạn có trải nghiệm với công cụ tạo khung **Yeoman**, bạn có thể giúp chúng tôi nâng cấp [verdaccio generator ](https://github.com/verdaccio/generator-verdaccio-plugin).

Dưới đây là một số ý tưởng:

* Tạo quy tắc chung Eslint để sử dụng trong tất cả các dependency hoặc plugin
* Cải thiện việc phân phối các loại quy trình xác định
* Di chuyển sang Webpack 4
* Nâng cấp mức độ thành phần của Webpack
* Chúng tôi sử dụng babel và webpack cho tất cả các dependency, tại sao chúng ta không thể sử dụng một cài đặt phổ biến khác?
* Nâng cấp việc phân phối tích hợp liên tục

### Tôi soạn tài liệu rất giỏi

Một số người đã góp ý cho chúng tôi về lỗi đánh máy và các vấn đề ngữ pháp, điều này đã giúp chúng tôi nâng cấp sự trải nghiệm và khắc phục sự cố chung.

### Tôi là một nhà thiết kế

Chúng tôi có trang web frontend [ http://www.verdaccio.org/](http://www.verdaccio.org/) và sẽ rất vui khi nhận sư chia sẻ những ý tưởng của các bạn.

Trang web của chúng tôi dựa trên [Docusaurus](https://docusaurus.io/).

### Tôi là một DevOps

We have a widely popular Docker image <https://hub.docker.com/r/verdaccio/verdaccio/> that need maintenance and pretty likely huge improvements, we need your knowledge for the benefits of all users.

We have support for **Kubernetes**, **Puppet**, **Ansible** and **Chef** and we need help in those fields, feel free to see all repositories.

### I can do translations

Verdaccio aims to be multilingual, in order to achieve it **we have the awesome support** of [Crowdin](https://crowdin.com) that is an amazing platform for translations.

<img src="https://d3n8a8pro7vhmx.cloudfront.net/uridu/pages/144/attachments/original/1485948891/Crowdin.png" width="400px" />

We have setup a project where you can choose your favourite language, if you do not find your language feel free to request one [creating a ticket](https://github.com/verdaccio/verdaccio/issues/new).

[Go to Crowdin Verdaccio](https://crowdin.com/project/verdaccio)

## I'm ready to contribute

If you are thinking *"I've seen already the [repositories](repositories.md) and I'm willing to start right away"* then I have good news for you, that's the next step.

You will need learn how to build, [we have prepared a guide just for that](build.md).

Once you have played around with all scripts and you know how to use them, we are ready to go to the next step, run the [**Unit Test**](test.md).

## Full list of contributors. We want to see your face here !

<a href="graphs/contributors"><img src="https://opencollective.com/verdaccio/contributors.svg?width=890&button=false" /></a>
