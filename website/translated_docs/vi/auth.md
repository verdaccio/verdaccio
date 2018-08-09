---
id: Yêu cầu xác thực
title: "Yêu cầu xác thực"
---
Yêu cầu xác thực được thông qua [plugin](plugins.md) mà bạn đang sử dụng. Vào [truy cập gói](packages.md) để biết danh mục các gói.

Tự khách hàng có thể dùng công cụ `npm` để xác minh tài khoản của mình. Bạn có thể đăng nhập vào ứng dụng bằng mã sau:

```bash
npm adduser --registry http://localhost:4873
```

Trong thư mục lưu trữ dữ liệu của người dùng trên File Server (File Server là một máy chủ chứa dữ liệu phân quyền thư mục và chia sẻ tài nguyên với nhau), một token được tạo ra trong tập tin cấu hình (config file) có sử dụng phương thức `npm`. Để biết thêm thông tin về `.npmrc`, xin hãy đọc phần [tài liệu chính thức](https://docs.npmjs.com/files/npmrc).

```bash
cat .npmrc
registry=http://localhost:5555/
//localhost:5555/:_authToken="secretVerdaccioToken"
//registry.npmjs.org/:_authToken=secretNpmjsToken
```

#### Chế độ công khai ẩn danh

Bạn có thể chọn chế độ công khai ẩn danh khi sử dụng `verdaccio`, để bật chế độ này lên bạn cần cài đặt phần [truy cập](packages.md) một cách chính xác.

Ví dụ:

```yaml
  'my-company-*':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
```

Như đã giải thích từ phần [vấn đề số #212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500) đến phần `npm@5.3.0` và trong tất cả các phiên bản phụ ** bạn sẽ không được phép công khai các mã code của mình nếu không có một token nào**. Tuy nhiên đối với công cụ quản lý thư viện `yarn` thì không có yêu cầu này.

## Tự động tạo ra tập tin htpasswd

Để đơn giản hóa quá trình cài đặt, `verdaccio` đã sử dụng plugin dựa vào tập tin `htpasswd`. [Plugin ngoài](https://github.com/verdaccio/verdaccio-htpasswd) đã được cài đặt mặc định trong phiên bản v3.0.x. V2.x trong package (gói) này vẫn là phiên bản tích hợp với plugin này.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    #max_users: 1000
```

| Lớp Property | Phương thức | Yêu cầu | Ví dụ      | Hỗ trợ | Miêu tả                                  |
| ------------ | ----------- | ------- | ---------- | ------ | ---------------------------------------- |
| file         | string      | Yes     | ./htpasswd | all    | file that host the encrypted credentials |
| max_users    | number      | No      | 1000       | all    | set limit of users                       |

In case to decide do not allow user to login, you can set `max_users: -1`.