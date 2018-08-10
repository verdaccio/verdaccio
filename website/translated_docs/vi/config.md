---
id: cấu hình
title: "Tệp cấu hình"
---
Tệp này là một phần quan trọng của Verdaccio, đây là nơi bạn có thể sửa đổi hành vi mặc định, bật plugin và mở rộng các tính năng.

Để cài tệp cấu hình mặc định đầu tiên, bạn chạy `verdaccio`.

## Cấu hình mặc định

Cấu hình mặc định có hỗ trợ gói **scoped** và cho phép truy cập ẩn danh vào các gói không phải riêng tư, nhưng chỉ ** người dùng đã đăng nhập mới có thể xuất bản gói **.

```yaml
storage: ./storage
auth:
  htpasswd:
    file: ./htpasswd
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
packages:
  '@*/*':
    access: $all
    publish: $authenticated
    proxy: npmjs
  '**':
    proxy: npmjs
logs:
  - {type: stdout, format: pretty, level: http}
```

## Các nội dung

Những nội dung sau sẽ giải thích ý nghĩa của từng thuộc tính và các tùy chọn khác nhau.

### Kho lưu trữ

Là nơi lưu trữ mặc định. **Verdaccio sử dụng bộ nhớ chế độ tệp cục bộ tích hợp theo mặc định **.

```yaml
storage: ./storage
```

### Plugins

Là vị trí của thư mục của plugin. Rất hữu ích cho cấu hình chạy trên hệ thống Docker / Kubernetes.

```yaml
plugins: ./plugins
```

### Yêu cầu xác thực

Cài đặt yêu cầu xác thực được thực hiện ở đây, sự xác thực mặc đình này chạy trên tệp tin` htpasswd ` và được tích hợp sẵn. Bạn có thể sửa đổi chế độ này bằng [ plugins ](plugins.md). Để biết thêm chi tiết về nội dung này, vui lòng đọc [ trang xác thực](auth.md).

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    max_users: 1000
```

### Web UI

Thuộc tính này cho phép bạn sửa đổi giao diện của web UI. Để biết thêm chi tiết về phần này, vui lòng đọc [ trang web ui ](web.md).

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
  scope:
```

### Uplinks

Khi những gói không phải là cục bộ, uplinks cho phép hệ thống lấy các gói này từ một cơ quan đăng ký từ xa. Để biết thêm chi tiết về nội dung này, vui lòng đọc [ trang Uplink ](uplinks.md).

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```

### Các loại gói

Các gói này cho phép người dùng kiểm soát quyền truy cập vào gói. Để biết thêm chi tiết về mô-đun này, vui lòng đọc [ trang gói ](packages.md).

```yaml
packages:
  '@*/*':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

## Cài đặt nâng cao

### Phát hành ngoại tuyến

` verdaccio ` theo mặc định không cho phép khách hàng phát hành khi họ ngoại tuyến. Bạn có thể thay đổi cài đặt này bằng cách cài thành * true*.

```yaml
publish:
  allow_offline: false
```

<small>Since: <code>verdaccio@2.3.6</code> due <a href="https://github.com/verdaccio/verdaccio/pull/223">#223</a></small>

### Tiền tố URL

```yaml
url_prefix: https://dev.company.local/verdaccio/
```

Since: `verdaccio@2.3.6` due [#197](https://github.com/verdaccio/verdaccio/pull/197)

### Thuộc tính Max Body Size

Thuộc tính Maximum body size của tệp JSON mặc định là `10mb ` và bạn có thể tăng giá trị này nếu bạn gặp lỗi như `"đối tượng yêu cầu quá lớn"`.

```yaml
max_body_size: 10mb
```

### Cổng nghe

`verdaccio ` được chạy mặc định trên cổng `4873 `. Cổng có thể được thay đổi thông qua [ cli ](cli.md) hoặc trong một tập tin cấu hình.

```yaml
listen:
# - localhost:4873            # default value
# - http://localhost:4873     # same thing
# - 0.0.0.0:4873              # listen on all addresses (INADDR_ANY)
# - https://example.org:4873  # if you want to use https
# - "[::1]:4873"                # ipv6
# - unix:/tmp/verdaccio.sock    # unix socket
```

### HTTPS

Để bật `https` trong `verdaccio`, chỉ cần sử dụng giao thức *https://* để đặt cờ `nghe `. Để biết thêm chi tiết về phần này, vui lòng đọc [ trang ssl ](ssl.md).

```yaml
https:
    key: ./path/verdaccio-key.pem
    cert: ./path/verdaccio-cert.pem
    ca: ./path/verdaccio-csr.pem
```

### Proxy

Proxy là một máy chủ HTTP làm nhiệm vụ chuyển tiếp thông tin và kiểm soát tạo sự an toàn cho việc chuyển dữ liệu từ máy chủ từ xa đến máy khách.

#### http_proxy and https_proxy

Nếu bạn có một proxy trên mạng của mình, bạn có thể đặt tiêu đề `X-Forwarded-For` với các thuộc tính sau.

```yaml
http_proxy: http://something.local/
https_proxy: https://something.local/
```

#### no_proxy

Biến này phải chứa danh sách các tiện ích mở rộng tên được phân cách bằng dấu phẩy không được proxy sử dụng.

```yaml
no_proxy: localhost,127.0.0.1
```

### Những thông báo

Enabling notifications to third-party tools is fairly easy via web hooks. For more information about this section read the [notifications page](notifications.md).

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
```

> For more detailed configuration settings, please [check the source code](https://github.com/verdaccio/verdaccio/tree/master/conf).

### Audit

<small>Since: <code>verdaccio@3.0.0</code></small>

`npm audit` is a new command released with [npm 6.x](https://github.com/npm/npm/releases/tag/v6.1.0). Verdaccio includes a built-in middleware plugin to handle this command.

> If you have a new installation it comes by default, otherwise you need to add the following props to your config file

```yaml
middlewares:
  audit:
    enabled: true
```