---
id: iss-server
title: "Cài đặt trên máy chủ IIS"
---
Những hướng dẫn này dành cho Windows Server 2012, IIS 8, [Node.js 0.12.3](https://nodejs.org/), [iisnode 0.2.16](https://github.com/tjanczuk/iisnode) và [verdaccio 2.1.0](https://github.com/verdaccio/verdaccio).

- Khi muốn cài đặt IIS bạn cần chạy [iisnode](https://github.com/tjanczuk/iisnode). Bạn cần chắc chắn mình tuân thủ các điều kiện cần thiết trong việc cài đặt (Mô-đun Rewrite Rewrite & node) như được mô tả trong các hướng dẫn iisnode.
- Bạn hãy tạo một thư mục mới trong Explorer để lưu trữ verdaccio. Ví dụ: `C:\verdaccio`. Lưu [package.json](#packagejson), [start.js](#startjs) và [web.config](#webconfig) vào thư mục này.
- Tạo một trang mới trong Trình quản lý dịch vụ thông tin Internet. Hãy đặt tên cho thư mục theo ý thích của bạn. Tôi sẽ gọi là verdaccio như trong [instructions](http://www.iis.net/learn/manage/configuring-security/application-pool-identities) này. Xác định đường dẫn để lưu tất cả các tệp và số cổng.
- Trở lại Explorer và cấp quyền cho người dùng sử dụng nhóm ứng dụng trong thư mục bạn vừa tạo. Trong trường hợp bạn đã đặt tên trang này là verdaccio và chưa sửa đổi nhóm ứng dụng, đồng thời trang đang chạy ứng dụng ApplicationPoolIdentity, bạn nên cấp cho người dùng quyền sửa đổi IIS AppPool\verdaccio. Nếu bạn cần trợ giúp, vui lòng tham khảo hướng dẫn. (Nếu cần, bạn có thể hạn chế quyền truy cập trong tương lai, chỉ cho phép quyền sửa đổi trong iisnode và verdaccio\storage)
- Bắt đầu dòng lệnh và thực hiện lệnh sau để tải verdaccio:

    cd c:\verdaccio
    npm install
    

- Hãy chắc chắn bạn có yêu cầu gửi đến rằng chấp nhận lưu lượng truy cập TCP vào cổng tường lửa của Windows
- Sau đấy bạn có thể điều hướng đến máy chủ và cổng mà bạn chỉ định

Tôi muốn trang web `verdaccio` trở thành trang mặc định trong IIS, vì vậy tôi đã làm như sau:

- Tôi chắc chắn sổ đăng ký cho tệp .npmrc trong `c:\users{yourname}` được đặt thành `"registry= http: // localhost /"`
- Tôi đã hủy bỏ "trang web mặc định" và chỉ bắt đầu trang "verdaccio" trong IIS
- I set the bindings to "http", ip address "All Unassigned" on port 80, ok any warning or prompts

These instructions are based on [Host Sinopia in IIS on Windows](https://gist.github.com/HCanber/4dd8409f79991a09ac75). I had to tweak my web config as per below but you may find the original from the for mentioned link works better

A default configuration file will be created `c:\verdaccio\verdaccio\config.yaml`

### package.json

```json
{
  "name": "iisnode-verdaccio",
  "version": "1.0.0",
  "description": "Hosts verdaccio in iisnode",
  "main": "start.js",
  "dependencies": {
    "verdaccio": "^2.1.0"
  }
}
```

### start.js

```bash
process.argv.push('-l', 'unix:' + process.env.PORT);
require('./node_modules/verdaccio/src/lib/cli.js');
```

### web.config

```xml
<configuration>
  <system.webServer>
    <modules>
        <remove name="WebDAVModule" />
    </modules>

    <!-- indicates that the start.js file is a node.js application
    to be handled by the iisnode module -->
    <handlers>
            <remove name="WebDAV" />
            <add name="iisnode" path="start.js" verb="*" modules="iisnode" resourceType="Unspecified" requireAccess="Execute" />
            <add name="WebDAV" path="*" verb="*" modules="WebDAVModule" resourceType="Unspecified" requireAccess="Execute" />
    </handlers>

    <rewrite>
      <rules>

        <!-- iisnode folder is where iisnode stores it's logs. These should
        never be rewritten -->
        <rule name="iisnode" stopProcessing="true">
          <match url="iisnode*" />
          <action type="None" />
        </rule>

        <!-- Rewrite all other urls in order for verdaccio to handle these -->
        <rule name="verdaccio">
          <match url="/*" />
          <action type="Rewrite" url="start.js" />
        </rule>
      </rules>
    </rewrite>

    <!-- exclude node_modules directory and subdirectories from serving
    by IIS since these are implementation details of node.js applications -->
    <security>
      <requestFiltering>
        <hiddenSegments>
          <add segment="node_modules" />
        </hiddenSegments>
      </requestFiltering>
    </security>

  </system.webServer>
</configuration>
```

### Troubleshooting

- **The web interface does not load when hosted with https as it tries to download scripts over http.**  
    Make sure that you have correctly mentioned `url_prefix` in verdaccio config. Follow the [discussion](https://github.com/verdaccio/verdaccio/issues/622).