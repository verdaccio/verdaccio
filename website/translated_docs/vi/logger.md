---
id: logger
title: "Logger"
---
Cũng như bất kỳ ứng dụng web nào, verdaccio có trình ghi nhật ký tích hợp tùy chỉnh. Bạn có thể lựa chọn nhiều loại đầu ra.

```yaml
logs:
  # console output
  - {type: stdout, format: pretty, level: http}
  # file output
  - {type: file, path: verdaccio.log, level: info}
```

Sử dụng `SIGUSR2` để thông báo cho ứng dụng biết rằng tệp nhật ký này đã bị lặp và cần được mở lại.

### Cấu hình

| Thuộc tính | Loại   | Yêu cầu | Ví dụ                                          | Hỗ trợ | Miêu tả                                 |
| ---------- | ------ | ------- | ---------------------------------------------- | ------ | --------------------------------------- |
| type       | string | No      | [stdout, file]                                 | all    | xác định đầu ra                         |
| path       | string | No      | verdaccio.log                                  | all    | nếu là tệp, hãy xác định vị trí của tệp |
| format     | string | No      | [pretty, pretty-timestamped]                   | all    | định dạng đầu ra                        |
| level      | string | No      | [fatal, error, warn, http, info, debug, trace] | all    | mức độ chi tiết                         |