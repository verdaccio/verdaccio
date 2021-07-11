---
id: iss-server
title: "Cài đặt trên máy chủ IIS"
---

These instructions were written for Windows Server 2016, IIS 10, [Node.js 10.15.0](https://nodejs.org/), [iisnode 0.2.26](https://github.com/Azure/iisnode) and [verdaccio 3.11.0](https://github.com/verdaccio/verdaccio).

* Install IIS Install [iisnode](https://github.com/Azure/iisnode). Make sure you install prerequisites (Url Rewrite Module & node) as explained in the instructions for iisnode.
* Bạn hãy tạo một thư mục mới trong Explorer để lưu trữ verdaccio. Ví dụ: `C:\verdaccio`. Lưu [package.json](#packagejson), [start.js](#startjs) và [web.config](#webconfig) vào thư mục này.
* Tạo một trang mới trong Trình quản lý dịch vụ thông tin Internet. Hãy đặt tên cho thư mục theo ý thích của bạn. Tôi sẽ gọi là verdaccio như trong [instructions](http://www.iis.net/learn/manage/configuring-security/application-pool-identities) này. Xác định đường dẫn để lưu tất cả các tệp và số cổng.
* Trở lại Explorer và cấp quyền cho người dùng sử dụng nhóm ứng dụng trong thư mục bạn vừa tạo. Trong trường hợp bạn đã đặt tên trang này là verdaccio và chưa sửa đổi nhóm ứng dụng, đồng thời trang đang chạy ứng dụng ApplicationPoolIdentity, bạn nên cấp cho người dùng quyền sửa đổi IIS AppPool\verdaccio. Nếu bạn cần trợ giúp, vui lòng tham khảo hướng dẫn. (Nếu cần, bạn có thể hạn chế quyền truy cập trong tương lai, chỉ cho phép quyền sửa đổi trong iisnode và verdaccio\storage)
* Bắt đầu dòng lệnh và thực hiện lệnh sau để tải verdaccio:

````
cd c:\verdaccio
npm install
````

* Hãy chắc chắn bạn có yêu cầu gửi đến rằng chấp nhận lưu lượng truy cập TCP vào cổng tường lửa của Windows
* Thats it! Now you can navigate to the host and port that you specified

Tôi muốn trang web `verdaccio` trở thành trang mặc định trong IIS, vì vậy tôi đã làm như sau:

* Tôi đã hủy bỏ "trang web mặc định" và chỉ bắt đầu trang "verdaccio" trong IIS
* Tôi cài đặt các binding thành "http" và địa chỉ Ip là "All Unassigned" ở cổng 80, nhấp vào ok cho bất kỳ cảnh báo hoặc lời nhắc nào

Những nguyên tắc này dựa trên [ Host Sinopia trong IIS trên Windows ](https://gist.github.com/HCanber/4dd8409f79991a09ac75). Tôi phải điều chỉnh cấu hình trang web của mình như sau, tuy nhiên bạn có thể nhận thấy cấu hình ban đầu trong liên kết được đề cập ở trên hoạt động tốt hơn

Tệp tin cấu hình mặc định `c:\verdaccio\verdaccio\config.yaml` sẽ được tạo

### package.json

````json
{
  "name": "iisnode-verdaccio",
  "version": "1.0.0",
  "description": "Hosts verdaccio in iisnode",
  "main": "start.js",
  "dependencies": {
    "verdaccio": "^3.11.0"
  }
}
````

### start.js

````bash
process.argv.push('-l', 'unix:' + process.env.PORT, '-c', './config.yaml');
require('./node_modules/verdaccio/build/lib/cli.js');
````

### Alternate start.js for Verdaccio versions < v3.0

````bash
process.argv.push('-l', 'unix:' + process.env.PORT);
require('./node_modules/verdaccio/src/lib/cli.js');
````

### web.config

````xml
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
            <conditions logicalGrouping="MatchAll" trackAllCaptures="false" />
            <action type="None" />
        </rule>

        <!-- Rewrite all other urls in order for verdaccio to handle these -->
        <rule name="verdaccio">
            <match url="/*" />
            <conditions logicalGrouping="MatchAll" trackAllCaptures="false" />
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
````

### Khắc phục sự cố
- **The web interface does not load when hosted with https as it tries to download scripts over http.** Make sure that you have enabled `X-Forwarded-Proto` in IISNode using `enableXFF`. See [the related issue](https://github.com/verdaccio/verdaccio/issues/2003).
````
<configuration>
  <system.webServer>
    <iisnode enableXFF="true" />
  </system.webServer>
</configuration>
````

