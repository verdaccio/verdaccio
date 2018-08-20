---
id: đóng góp
title: "Tham gia đóng góp Verdaccio"
---
First of all Để có thể sử dụng một cơ sở mã hoàn toàn mới là điều không hề dễ dàng, vì vậy chúng tôi luôn sẵn sàng giúp đỡ bạn.

## Kênh trao đổi

Nếu bạn có bất cứ câu hỏi nào, xin hãy gửi cho chúng tôi qua hai kênh sau để cùng thảo luận:

* [Kênh Discord công khai](http://chat.verdaccio.org/)

## Bắt đầu

Thoạt nhìn, verdaccio chỉ là một kho lưu trữ đơn giản, nhưng bên trong lại có nhiều cách khác nhau để bạn có thể đóng góp và một loạt các công nghệ để bạn thực hành.

### Tìm vị trí phù hợp với tôi

Mỗi người đều có các kỹ năng khác nhau, vì vậy hãy xem và cảm nhận phần nào bạn cảm thấy có thể phát huy tối đa kỹ năng của mình.

### Tôi biết hoặc tôi muốn tìm hiểu về Node.js

Node.js là một hệ thống phần mềm dựa trên `verdaccio`, chúng tôi sử dụng `express`, `commander `, `request` hoặc `async ` làm thư viện của chương trình. Về cơ bản, Verdaccio là một Rest API, giống như `yarn`, tạo ra giao tiếp tương thích với máy khách `npm`.

Chúng tôi có rất nhiều [danh sách plugin](plugins.md) có sẵn và đã được nâng cấp, nhưng đồng thời [bạn cũng có thể tạo plugin của riêng mình](dev-plugins.md).

### Tôi thích làm việc trong giao diện người dùng hơn

Thời gian gần đây, chúng tôi đã chuyển sang các công nghệ hiện đại như `React` và `element-react`. Chúng tôi mong được biết đến những ý tưởng mới về cách nâng cấp giao diện người dùng.

### Việc nâng cấp ngăn xếp sẽ giúp tôi cảm thấy thoải mái hơn

Tất nhiên, chúng tôi sẽ vui lòng giúp bạn sắp xếp ngăn xếp và bạn có thể nâng cấp các gói phụ thuộc của mình lên `eslint `, `stylelint`, `webpack`. Bạn cũng nên nâng cấp cấu hình `webpack`. Chúng tôi hoan nghênh mọi ý kiến đóng góp của các bạn. Ngoài ra, nếu bạn có trải nghiệm với công cụ tạo khung **Yeoman**, bạn có thể giúp chúng tôi nâng cấp [verdaccio generator ](https://github.com/verdaccio/generator-verdaccio-plugin).

Dưới đây là một số ý tưởng:

* Tạo quy tắc chung Eslint để sử dụng trong tất cả các gói phụ thuộc hoặc những phần mềm bổ trợ
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

Chúng tôi có một hình ảnh Docker được sử dụng rộng rãi [ https://hub.docker.com/r/verdaccio/verdaccio/](https://hub.docker.com/r/verdaccio/verdaccio/), nó cần được bảo trì và có thể cần được nâng cấp khá nhiều, chúng tôi cần kiến ​​thức của bạn để mang lại lợi ích cho tất cả người dùng.

Chúng tôi hỗ trợ phần ** Kubernetes**, **Puppet **, **Ansible** và **Chef**, và cần sự đóng góp của các bạn ở những nội dung này, vui lòng kiểm tra tất cả kho tài nguyên.

### Tôi có thể dịch tài liệu

Mục tiêu của Verdaccio là đa ngôn ngữ, để đạt được mục tiêu này, **chúng tôi đã nhận được sự giúp đỡ tuyệt vời** từ [ Crowdin ](https://crowdin.com) - một nền tảng hoàn hảo dành cho việc dịch thuật.

<img src="https://d3n8a8pro7vhmx.cloudfront.net/uridu/pages/144/attachments/original/1485948891/Crowdin.png" width="400px" />

Chúng tôi đã lập một dự án mà bạn có thể chọn ngôn ngữ yêu thích của mình, nếu bạn không tìm thấy ngôn ngữ mình muốn, vui lòng khởi chạy <a href = "https://github.com/verdaccio/verdaccio/issues/new">Tạo một vé yêu cầu</a>.

[Tham gia Crowdin Verdaccio](https://crowdin.com/project/verdaccio)

## Tôi đã sẵn sàng đóng góp vào bản dịch

Nếu bạn đang nghĩ *"Tôi đã xem [kho lưu trữ ](repositories.md) và sẵn sàng đóng góp vào bản dịch ngay*, thì đó là một tin tốt để bạn có thể tiếp tục bước tiếp theo.

Bạn cần phải tìm hiểu cách đóng góp vào bản dịch, [ chúng tôi đã sẵn sàng hướng dẫn cho bạn ](build.md).

Khi bạn đã làm quen với tất cả các tập lệnh và biết cách sử dụng, chúng tôi sẵn sàng chuyển sang bước tiếp theo và bắt đầu chạy [**kiểm tra đơn vị**](test.md).

## Dưới đây là danh sách đầy đủ các cộng tác viên. Chúng tôi hy vọng sẽ gặp bạn ở đây!

<a href="graphs/contributors"><img src="https://opencollective.com/verdaccio/contributors.svg?width=890&button=false" /></a>
