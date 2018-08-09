---
id: yêu cầu xác thực
title: "Yêu cầu xác thực"
---
Cài đặt yêu cầu xác thực có liên quan chặt chẽ đến [plugin](plugins.md) mà bạn đang sử dụng. Giới hạn truy cập gói cũng được kiểm soát thông qua [quyền truy cập gói](packages.md).

Quá trình xác thực của khách hàng được xử lý bởi chính công cụ `npm`. Bạn có thể đăng nhập vào ứng dụng bằng lệnh sau:

```bash
npm adduser --registry http://localhost:4873
```

`npm` sẽ lưu Token được Verdaccio trả về trong tệp cấu hình, tệp này sẽ được lưu trữ trong thư mục chính của bạn. Để biết thêm thông tin về `.npmrc`, xin hãy đọc phần [tài liệu chính thức](https://docs.npmjs.com/files/npmrc).

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

Như đã giải thích từ phần [issue #212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500) đến phần `npm@5.3.0` và trong tất cả các phiên bản phụ ** bạn sẽ không được phép công khai các mã code của mình nếu không có một token nào**. Tuy nhiên đối với công cụ quản lý thư viện `yarn` thì không có yêu cầu này.

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

| Lớp Property | Phương thức | Yêu cầu | Ví dụ      | Hỗ trợ | Miêu tả                                      |
| ------------ | ----------- | ------- | ---------- | ------ | -------------------------------------------- |
| tập tin      | string      | Có      | ./htpasswd | tất cả | tập tin lưu trữ các thông tin đã được mã hóa |
| max_users    | số          | Không   | 1000       | tất cả | giới hạn người dùng                          |

Trường hợp bạn không muốn người dùng đăng nhập, bạn cài đặt `max_users: -1`.