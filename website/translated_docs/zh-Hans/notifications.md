---
id: 通知
title: "通知"
---
创建通知主要是与Slack的输入webhooks一起使用，但它也会传递简单的载荷到任何末端。目前只对 `npm publish`命令有效。

## 使用

**HipChat**, **Stride** 和 **Google Hangouts Chat** hook的一个范例:

> Verdaccio 支持任何 API, 请随意添加更多范例。

#### 单个通知

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
```

#### 多通知

```yaml
notify:
  'example-google-chat':
    method: POST
    headers: [{'Content-Type': 'application/json'}]
    endpoint: https://chat.googleapis.com/v1/spaces/AAAAB_TcJYs/messages?key=myKey&token=myToken
    content: '{"text":"New package published: `{{ name }}{{#each versions}} v{{version}}{{/each}}`"}'
  'example-hipchat':
     method: POST
     headers: [{'Content-Type': 'application/json'}]
     endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
     content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
  'example-stride':
     method: POST
     headers: [{'Content-Type': 'application/json'}, {'authorization': 'Bearer secretToken'}]
     endpoint: https://api.atlassian.com/site/{cloudId}/conversation/{conversationId}/message
     content: '{"body": {"version": 1,"type": "doc","content": [{"type": "paragraph","content": [{"type": "text","text": "New package published: * {{ name }}* Publisher name: * {{ publisher.name }}"}]}]}}'     
```

## 模板

我们用[Handlebars](https://handlebarsjs.com/) 作为主要模板引擎。

### 格式范例

    # 重复所有版本
    {{ name }}{{#each versions}} v{{version}}{{/each}}`"}
    
    # 已发布的发表人和 `dist-tag` 包
    {{ publisher.name }} has published {{publishedPackage}}"}
    

### 属性

通过模板进入的属性列表

* 元数据
* 发表者（在发表的人）
* 已发布的包（包@1.0.0)

### 元数据

模板可以访问的包元数据

    {
        "_id": "@test/pkg1",
        "name": "@test/pkg1",
        "description": "",
        "dist-tags": {
            "beta": "1.0.54"
        },
        "versions": {
            "1.0.54": {
                "name": "@test/pkg1",
                "version": "1.0.54",
                "description": "some description",
                "main": "index.js",
                "scripts": {
                    "test": "echo \"Error: no test specified\" && exit 1"
                },
                "keywords": [],
                "author": {
                    "name": "Author Name",
                    "email": "author@domain.com"
                },
                "license": "MIT",
                "dependencies": {
                    "webpack": "4.12.0"
                },
                "readmeFilename": "README.md",
                "_id": "@ test/pkg1@1.0.54",
                "_npmVersion": "6.1.0",
                "_nodeVersion": "9.9.0",
                "_npmUser": {},
                "dist": {
                    "integrity": "sha512-JlXWpLtMUBAqvVZBvH7UVLhXkGE1ctmXbDjbH/l0zMuG7wVzQ7GshTYvD/b5C+G2vOL2oiIS1RtayA/kKkTwKw==",
                    "shasum": "29c55c52c1e76e966e706165e5b9f22e32aa9f22",
                    "tarball": "http://localhost:4873/@test/pkg1/-/@test/pkg1-1.0.54.tgz"
                }
            }
        },
        "readme": "# test",
        "_attachments": {
            "@test/pkg1-1.0.54.tgz": {
                "content_type": "application/octet-stream",
                "data": "H4sIAAAAAAAAE+y9Z5PjyJIgOJ ...",
                "length": 33112
            }
        },
        "time": {}
    }
    

### 发表人

您可以用`publisher` object(对象）在webhook的`content`里访问包发表人信息。

请参阅以下`publisher` object（对象）类别：

    {
      name: string,
      groups: string[],
      real_groups: string[]
    }
    

范例：

    notify:
      method: POST
      headers: [{'Content-Type': 'application/json'}]
      endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
      content: '{"color":"green","message":"New package published: * {{ name }}*. Publisher name: * {{ publisher.name }} *.","notify":true,"message_format":"text"}'
    

**请注意:** 如果 `package.json` 文件已经有`publisher`属性，是不可能再拿到发表人信息的。

### 已发布包

您可以如以下所示用热词`{{publishedPackage}}` 来访问已经发布的包.

    {{ publisher.name }} has published {{publishedPackage}}"}
    

## 配置

| 属性                  | 类型           | 必填  | 支持  | 默认 | 描述                                          |
| ------------------- | ------------ | --- | --- | -- | ------------------------------------------- |
| method              | string       | No  | all |    | HTTP verb                                   |
| packagePattern      | string       | No  | all |    | 仅当包名字和正规表达式匹配时才运行此通知                        |
| packagePatternFlags | string       | No  | all |    | 任何与正规表达式一起使用的标记                             |
| headers             | array/object | Yes | all |    | 如果此端点需要特定的标头，请把它们设置为键数组：value objects（值对象）。 |
| endpoint            | string       | Yes | all |    | 设置此调用的URL 端点                                |
| content             | string       | Yes | all |    | 任何[Handlebar](https://handlebarsjs.com/)表达式 |