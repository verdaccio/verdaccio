---
id: protect-your-dependencies（保护-依赖项）
title: "保护包"
---
`verdaccio` 允许发布保护，为了要使用此功能，您将需要正确设置[包访问权限](packages)。

### 包配置

例如，让我们一起来看以下设置。 您有一组前缀为`my-company-*`的依赖项，您要保护它们不让匿名或另一个没有正确证书的已登录用户使用。

```yaml
  'my-company-*':
    access: admin teamA teamB teamC
    publish: admin teamA
    proxy: npmjs
```

通过此配置，大体上上我们允许**admin** 和**teamA** 团队来 *发布*，同时**teamA** **teamB** **teamC** *可访问* 这些依赖项。

### 用例：teamD试着访问此依赖项

因此，如果我以**teamD**身份登录。我应该无法访问匹配`my-company-*` pattern的所有依赖项。

```bash
➜ npm whoami
teamD
```

我无法访问此类依赖项，并且在网页上也不会被用户 **teamD**看到。如果我试着访问，结果如下。

```bash
➜ npm install my-company-core
npm ERR! code E403
npm ERR! 403 Forbidden: webpack-1@latest
```

或者用`yarn`

```bash
➜ yarn add my-company-core
yarn add v0.24.6
info No lockfile found.
[1/4] 
错误出现意外错误: "http://localhost:5555/webpack-1: 不允许未注册用户访问my-company-core包"。
```