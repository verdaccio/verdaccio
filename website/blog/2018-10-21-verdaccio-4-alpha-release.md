---
author: Juan Picado
authorURL: https://twitter.com/jotadeveloper
authorFBID: 1122901551
title: Verdaccio 4 alpha release
---

Since a couple of months ago, **verdaccio@4.0.0** is under development, we want to give you a first update of the current list of features ready to be tested and incoming ones.

![](https://cdn-images-1.medium.com/max/1024/1*GK9U1wZmB0JUN2XGhu5LjA.png)

<!--truncate-->

### What’s new in Verdaccio 4 Alpha? 🐣 {#whats-new-in-verdaccio-4-alpha-}

#### Tokens 🛡 {#tokens-}

Improve security is one of our main goals, we have wanted to improve in one of the most important areas for the users, **tokens**. Currently the token verification is based on unpack the token for each request and ask the plugin whether the author is authorized. This might be a bit overwhelming if the authentication’s provider is not good handling a big amount of request or is totally unnecessary.

For that reason we are shipping a **new way to generate token based on JSON Web Token (JWT)** standard. This feature does not replace the current implementation and will remains as optional. To enable JWT on API is quite simple as we show in the following example.

```
security:
 api:
 jwt:
 sign:
 expiresIn: 60d
 notBefore: 1
 web:
 sign:
 expiresIn: 7d
```

We will allow to customize JWT by demand, for instance, **allowing to expire tokens**. _We will go deep into the new JWT system in future articles_.

<!--truncate-->

#### Change Password 🔐 {#change-password-}

Perhaps the most asked question in our forum and a so trivial action that might be no a problem nowadays. We have listen the community and invested time in this important feature.

```
npm profile set password -ddd --registry http://localhost:4873/
```

We allow change password via CLI using the npm profile . Currently the support is limited to the htpasswd [built-in plugin](https://github.com/verdaccio/verdaccio-htpasswd), but in some point the plugin developers will take advance of this support.

#### Keep it update 🛰 {#keep-it-update-}

We want to help you to keep it updated, for that reason we are shipping a CLI notification that display the latest stable version available.

![](https://cdn-images-1.medium.com/max/1024/1*Yw0NdQlZgm46s5cAgew1VQ.png)

#### New UI 💅🏻 {#new-ui-}

We are aware that our UI has been simple, but we decided it is the time to scale it up in order to add new features. For that reason we planed a migration to a new UI toolkit that will help ups to achieve that goal, **Material-UI**.

As a first step we migrated the current UI improving the header. But that’s not all is coming, we have big incoming plans in the next alpha releases, for instance:

- Change password from UI
- i18n
- Improvements in the detail page

We are open to new ideas, feel free to suggest or share your thoughts during this development phase.

#### Docker 🐳 {#docker-}

We have reduced the size of the image and following the best practices adding a namespace VERDACCIO_XXX_XXX for environment variables. Many other new things are planned for our popular image that **to this day we have almost 2,5 millions pulls**.

#### Future 🔮 {#future-}

I’d like to share our roadmap wether you are interested to know what is in our TODO list and you invite you to contribute or drop your thoughts in any of our channels, we like to listen feedbacks.

[verdaccio/verdaccio](https://github.com/verdaccio/verdaccio/projects/10)

### How to install {#how-to-install}

```
npm install -g verdaccio@next
```

or using Docker

```
docker pull verdaccio/verdaccio:4.x-next
```

⚠️We highly recommend don’t use alpha versions 🚧in production, but if you are willing to test, **always do a backup of your storage and config files**. In any case, we are really careful with our deployments and are always highly reliable, but, we are humans after all.

However, if you are using Verdaccio 3, there are some small breaking changes you should keep on mind, specially for those are using environment variables with Docker, [all details here](https://github.com/verdaccio/verdaccio/pull/924).

### Contributions and Community 🌍 {#contributions-and-community-}

Verdaccio is an open source project, but also we aims to be a nice community and I’d like to introduce you **the team that grain by grain is crafting this amazing project**.

[Verdaccio · A lightweight private npm proxy registry](https://verdaccio.org/en/team)

We thanks all contributors, either via GitHub or translations, **any contribution is gold for us.**

### Donations 👍🏻 {#donations-}

I’d like to reminder our readers that there are other ways to contribute to this project **becoming a backer**. Furthermore, all contributors are voluntaries and nobody is working full time on this project, but we are aware is getting bigger and deserves some promotion.

[verdaccio - Open Collective](https://opencollective.com/verdaccio)

For those are already backers and sponsors, thanks so much 👏👏👏.

If you have the chance to meet any of our team members, feel free to ask for stickers (hopefully they will carry some), we use our budget mostly for promotion and you can help us to spread the voice, give your start or just recommend with your colleagues how great is Verdaccio.

### Wrapping Up 👋🏼 {#wrapping-up-}

If you live near Vienna (Austria), **we will have a presentation in early next year (January 2019) at ViennaJS meetup**, feel free to join us if you want to know more about this project.

[ViennaJS January 2019 - Meetups - ViennaJS Monthly Meetups](https://viennajs.org/en/meetup/2019-01)

A future core team meeting will take place between 29th and 30th November at **Berlin** , we are attending [React Day Berlin](https://reactday.berlin/), feel free to DM if you want to have a chat to any of us.

---
