---
id: notifications
title: "Notifications"
---
Notify was built primarily to use with Slack's Incoming webhooks, but will also deliver a simple payload to any endpoint. Currently only active for `publish` / `create` commands.

## Usage

An example with a **HipChat** and **Google Hangouts Chat** hook:

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
```

## Configuration

| Property            | Type         | Required | Support | Default | Description                                                                                  |
| ------------------- | ------------ | -------- | ------- | ------- | -------------------------------------------------------------------------------------------- |
| method              | string       | No       | all     |         | HTTP verb                                                                                    |
| packagePattern      | string       | No       | all     |         | Only run this notification if the package name matches the regular expression                |
| packagePatternFlags | string       | No       | all     |         | Any flags to be used with the regular expression                                             |
| headers             | array/object | Yes      | all     |         | If this endpoint requires specific headers, set them here as an array of key: value objects. |
| endpoint            | string       | Yes      | all     |         | set the URL endpoint for this call                                                           |
| content             | string       | Yes      | all     |         | any [handlebar](https://handlebarsjs.com/) expressions                                       |