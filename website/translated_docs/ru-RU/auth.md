---
id: authentication
title: "Аутентификация"
---

The authentication is tied to the auth [plugin](plugins.md) you are using. The package restrictions are also handled by the [Package Access](packages.md).

The client authentication is handled by the `npm` client itself. Once you log in to the application:

```bash
npm adduser --registry http://localhost:4873
```

В файле конфигурации `npm`, расположенном в домашней директории пользователя, генерируется токен. Больше информации о `.npmrc` читайте в [официальной документации](https://docs.npmjs.com/files/npmrc).

```bash
cat .npmrc
registry=http://localhost:5555/
//localhost:5555/:_authToken="secretVerdaccioToken"
//registry.npmjs.org/:_authToken=secretNpmjsToken
```

#### Анонимная публикация

`verdaccio` allows you to enable anonymous publish. To achieve that you will need to correctly set up your [packages access](packages.md).

Например:

```yaml
  'my-company-*':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
```

Как описано в [issue #212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500) до `npm@5.3.0`, включая все минорные релизы, **не позволят вам публикацию без токенов**.

## О группах

### Как понимать `$all` и `$anonymous`

As you know *Verdaccio* uses `htpasswd` by default. Этот плагин не реализует методы `allow_access`, `allow_publish` и `allow_unpublish`. И *Verdaccio* будет действовать таким образом:

* Если вы не залогинены (вы - аноним), `$all` and `$anonymous` означают одно и то же.
* If you are logged in, `$anonymous` won't be part of your groups and `$all` will match any logged user. A new group `$authenticated` will be added to your group list.

Please note: `$all` **will match all users, whether logged in or not**.

**Все описанное выше - только про плагин аутентификации по умолчанию**. Если вы используете кастомный плагин и этот плагин реализует `allow_access`, `allow_publish` или `allow_unpublish`, то разрешения будут зависет от этого вашего плагина. Verdaccio установит только группы по умолчанию.

Отметим еще раз:

* **logged in**: `$all` and `$authenticated` + groups added by the plugin.
* **logged out (anonymous)**: `$all` and `$anonymous`.

## Стандартный htpasswd

In order to simplify the setup, `verdaccio` uses a plugin based on `htpasswd`. Since version v3.0.x the `verdaccio-htpasswd` plugin is used by default.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Максимальное количество пользователей, которые могут зарегистрироваться. По умолчанию "+inf".
    # Вы можете установить -1 для отключения регистрации пользователей.
    #max_users: 1000
```

| Свойство  | Тип    | Обязательное | Пример     | Поддержка | Описание                                      |
| --------- | ------ | ------------ | ---------- | --------- | --------------------------------------------- |
| file      | string | Да           | ./htpasswd | все       | файл, содержащий зашифрованные учетные данные |
| max_users | number | Нет          | 1000       | все       | ограничение на количество пользователей       |

In case you decide to prevent users from signing up themselves, you can set `max_users: -1`.