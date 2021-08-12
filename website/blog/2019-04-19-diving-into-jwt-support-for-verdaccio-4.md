---
author: Juan Picado
authorURL: https://twitter.com/jotadeveloper
authorFBID: 1122901551
title: Diving into JWT support for Verdaccio 4
---

![](https://cdn.verdaccio.dev/blog/1_t9d16DIcJg_-dEg0X_qTWg.png)

If you are already using [Verdaccio 4](https://github.com/verdaccio/verdaccio) you are can immediately use the new token signature support with JWT or [JSON Web Tokens](https://github.com/auth0/node-jsonwebtoken).

```
npm install -g verdaccio@next
```

This article will explain what are the advantages of using JWT instead of the traditional or _legacy_ token signature used by Verdaccio. But before that, we need to be int he same page about ** JWT.**

I’d recommend reading the following article before continue the reading.

[5 Easy Steps to Understanding JSON Web Tokens (JWT)](https://medium.com/vandium-software/5-easy-steps-to-understanding-json-web-tokens-jwt-1164c0adfcec)

<!--truncate-->

### Context {#context}

**Verdaccio 3** uses by default a token signature are based on [AES192 encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), that has been a legacy implementation inherited by [Sinopia](https://www.npmjs.com/package/sinopia).

This token signature consists of the combination of user:password signed using a **SALT secret key**. Every time a resource is requested, the client package manager will send this token within the request if the user is logged in and will decrypt and send it through the authentication plugin to validate the credentials.

This might create a bit of spamming due Verdaccio is a stateless RESTful API and it is likely no caching involved in the authentication process.

This has been working fine so far, but, some **users do not need to check credentials for every request** , for such reason, we decided to ship on a new way to sign tokens giving a different set of rules the users can structure their authentication process.

**JWT** does not replace the current token signature system, thus, **no breaking changes come on Verdaccio 4,** both systems are completely different and by demand, but you need to decide to use only one of them.

### Setup {#setup}

By default, the **AES192** or _legacy_ system is being used by default and we do not have plans to remove it.

If you want to enable JWT, just add into your configuration file the new property security .

```
security:
  api:
    legacy: false
    jwt:
      sign:
        expiresIn: 60d
        notBefore: 1
      verify:
        algorithm:
        expiresIn:
        notBefore:
        ignoreExpiration:
        maxAge:
        clockTimestamp:
  web:
    sign:
      expiresIn: 7d
```

#### api and web {#api-and-web}

The security section is composed by in two main sections. Each section will use same _JWT properties_ but the configuration structure is different. The web section does not have to deal with **legacy** support, thus, will group **sign** and **verify** properties directly as children.

While the **api** section contains a different level of properties, we will go through them in the next sections.

#### legacy {#legacy}

Legacy property means that **explicitly you want to use the legacy token system signature**. You might not like to do not remove the whole security section in order to disable JWT and for such reason, this property exists.

> The rule is simple, if _legacy_ is _true_, will be enabled it even if the _jwt_ exist. But, if you do not want to use _legacy_ just do not declare it or just set it as _false_ .

#### jwt {#jwt}

To enable _JWT_ you need to append the property jwt within the api section.

Similar as the **web** section inside of security also contains different options for _sign_ and _verify_.

#### Signature and Verify {#signature-and-verify}

The options for **sign** or **verify** defined inside of either web or apiare well explained in the section by the [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#usage) library from **Auth0**.

You can use them freely according to your needs, Verdaccio will just delegate whatever you define within such sections directly to the jsonwebtoken library.

### Legacy vs JWT {#legacy-vs-jwt}

If you are happy with the current signature, we recommend keeping it, but if there are some differences you might need to know.

If you are interested to **expire tokens** , use a **different algorithm** , JWT fits more in your needs.

JWT also contains an immutable payload, meaning that, once the token is being signed, **we store the list of assigned user groups within the payload**. Thus, for each request the API does not verify credentials against the authentication provider, it just verifies whether the token is valid and provides access to the resource. It is important to highlight that the JWT **payload does not contain sensitive information as email or password.**

In the other side, if you are interested to have full control of the credentials, the **legacy** signature might be better for you. In such a case, it is important to remind **the token delivered is the combination of sensitive information signed with a SALT key** and the authentication provider will be hit for each resource requested.

### Conclusion {#conclusion}

We have tried to provide different methods of the token signature according to your needs, the JWT looks promising and will be an optional feature for **Verdaccio 4.**

Let us your feedback, any concern or advice is very welcome.

[verdaccio/verdaccio](https://github.com/verdaccio/verdaccio)

I would like to finish with a reminder that Verdaccio is a FOSS product which has as a unique backup the community of developers working in their spare time.

If you are willing to support the project, feel free donate over OpenCollective.

[https://opencollective.com/verdaccio](https://opencollective.com/verdaccio)

**Enjoy** [**Verdaccio 4**](https://github.com/verdaccio/verdaccio) ** 🤓**

Thanks, [Luiz Filipe Machado Barni](https://medium.com/u/34137e4bcaf7) for the contribution to this article.

---
