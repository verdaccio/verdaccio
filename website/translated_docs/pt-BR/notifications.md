---
id: notifications
title: Notifications
---
Notify was built primarily to use with Slack's Incoming webhooks, but will also deliver a simple payload to any endpoint. Currently only active for `publish` / `create` commands.

## Usage

An example with a **hipchat** hook:

#### Single notification

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
```

#### Multiple notification

```yaml
notify:
  'example-package-1'
     method: POST
     headers: [{'Content-Type': 'application/json'}]
     endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
     content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
  'example-package-2'
     method: POST
     headers: [{'Content-Type': 'application/json'}]
     endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
     content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
  'example-package-3'
     method: POST
     headers: [{'Content-Type': 'application/json'}]
     endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
     content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'


```

## Configuration

| Property            | Type         | Required | Support | Default | Description                                                                                  |
| ------------------- | ------------ | -------- | ------- | ------- | -------------------------------------------------------------------------------------------- |
| method              | string       | No       | all     |         | HTTP verb                                                                                    |
| packagePattern      | string       | No       | all     |         | Only run this notification if the package name matches the regular expression                |
| packagePatternFlags | string       | No       | all     |         | Any flags to be used with the regular expression                                             |
| headers             | array/object | Yes      | all     |         | If this endpoint requires specific headers, set them here as an array of key: value objects. |
| endpoint            | string       | Yes      | all     |         | set the URL endpoint for this call                                                           |
| content             | string       | Yes      | all     |         | any Handlebar expressions                                                                    |