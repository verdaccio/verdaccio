---
title: Five use cases where a npm private proxy fits in your workflow
author: Juan Picado
authorURL: http://twitter.com/jotadeveloper
authorFBID: 1122901551
---

This article is about why setting up a npm private proxy is a good idea, going through most common questions that I’ve been asked since contributing to sinopia’s fork [verdaccio](http://www.verdaccio.org/), and how a developer addresses many use cases that made me appreciate how useful it can be set up a local private proxy
Let’s review them.

## As offline installation

![An image from the slides doesn’t load due lack of connection](/img/blog/offline.png)

These days the solution to offline mode is called yarn and lately npm@5.x . It’s a valid argument, both clients are awesome. The offline mode works fine but does not solve all the offline issues.

<!--truncate-->

* Developer Teams: Yarn caches all your packages locally avoiding the possibility of you inadvertently sharing it within your company. Besides it is not unusual that anyone in your team stops working because he/she is unable to download any new dependency due lack of Internet connection.
* Traveling: I’m a traveler 🛫 and I have to face this pretty often, either roaming or 3G makes downloading any tarball take an eternity. Have you coded while you traveling in an airplane?
* IT Conferences: Please raise your hand if you have had connection issues in IT conferences as a speaker 😓 or attendee 😩. You might argue that **yarn/npm** can solve this. I agree with you, but, there are dozens of use cases that won’t be covered by their offline mode. For instance, a new dependency version you cannot publish yet publicly or pure demonstrations of publishing, dist-tags and any other command from yarn or npm. I recognize that having a local registry is pretty handy.

> Verdaccio is able to install and publish in offline mode.

Being offline seems to not be an issue in modern countries most of the time. But, reading the topics in verdaccio it is amazing how frequent it is for people to have internet restrictions in his own companies and their easier solution is backup the whole storage and restore it at work.

## As a hub to pull from many registries

![verdaccio/sinopia uplink concept](/img/blog/hub.png)

Handling multiple registries is something quite common these days and to keep switching is really a slow and annoying process.

```
npm install --registry http://localhost:4873
```
Well, lately I found [this tool](https://github.com/Pana/nrm) to make this process painless, but still …
Also, something is quite usual that many [developers use paid registries](https://github.com/verdaccio/verdaccio/issues?utf8=%E2%9C%93&q=Artifactory%20OR%20nexus%20) as JFrog Artifactory or Nexus3 ([Nexus has a free npm OSS](https://www.sonatype.com/nexus-repository-oss)) and sometimes online access is restricted for such registries.

### How verdaccio solves this?

Easy peasy, it uses [uplinks](https://github.com/verdaccio/verdaccio/blob/master/wiki/uplinks.md). You can proxy multiple registries using a single one instead, that’s cool, right?

```yaml
uplinks:
  npmjs:
   url: https://registry.npmjs.org/
  server2:
    url: http://mirror.local.net/
  server3:
    url: http://mirror2.local.net:9000/
  yarn:
    url: https://registry.yarnpkg.com/
```

Uplinks **allow you to set multiples registries and you can define later on which dependencies should be resolved by any of your multiple registries**. Even if any of them require any sort of specific header you can add/override them.

## As a staging registry server

![http://www.commitstrip.com/en/](/img/blog/staging.jpeg)

All of you are used to dealing with a staging server. It’s the final step before going into production and where we test our projects, which might, in the end, depend on private npm modules as well.
Didn’t it happen to you that you found a bug in your favorite project and despite being easy to fix, they took years until they released a patch 😩😩 ? Yeah, 😅 I’m [one of those](https://github.com/verdaccio/verdaccio/issues?q=is%3Aissue+is%3Aopen+sort%3Acreated-asc), but I always try to reply asap 🙃.
Let’s say you are using lodash and it turns out that it is an important library in your project and you need this fixed right now. You have some options here:

* [Commit](https://medium.com/@bestander_nz/my-node-modules-are-in-git-again-4fb18f5671a) `node_modules/lodash` ? That’s nasty.
* Fix locally and pack the tarball within your package and reference it from `package.json` ? Well .. I did that one or two times. But frankly …how are you planning to get the future official patch then? You will need to switch again the dependency to a semver version anyway.

```
"dependencies": {
    "lodash": "./packages/lodash.patch.tar.gz"
}
```
* [Git reference is an usual work around](https://stackoverflow.com/a/23210615/308341), but frankly, I don’t like it.

```
"dependencies" : {
  "name1" : "git://github.com/user/project.git#commit-ish",
  "name2" : "git://github.com/user/project.git#commit-ish"
}
```

Either if you have to deal with bugs or you have a registry running in your organization, a staging server comes quite handy when hosting all your private modules. You might have multiple servers or Docker containers which will require all your modules to be centralized in a single spot.

## I need a Light Solution

![A developer bored to wait for an endless installation](/img/blog/wait.jpeg)

The setup is always a critical step when a developer decides whether or not use a software. Read the a long Getting Started guide discourages any developer and most of the times it completely pisses you off when any step fails 😤.
The verdaccio installation is quite fast and does not requires any configuration other than have node.js installed.

```
npm install -g verdaccio
```

You can customize later on as your wish, nevertheless the default configuration is good enough for the most of developers.

![A developer bored to wait for an endless installation](/img/blog/runningVerdaccio.gif)

And that’s all. Ins’t a big deal huh? Indeed it. You can start playing around with it.

## Composite with Docker

![http://www.commitstrip.com/en/](/img/blog/compose_swarm.png)

If you have a stack based in Docker you might want to combine your local registry in the workflow.

As you might know the [lock files keep references of the registry](https://github.com/yarnpkg/yarn/issues/579#issuecomment-253115162), ([#2](https://github.com/yarnpkg/rfcs/pull/64), and [#3](https://github.com/yarnpkg/yarn/issues/3330)) ,for each dependency, but, it’s seems npm does not do it. That will be a problem if you rely on lock files and your containers are not able to resolve the registry.

Verdaccio is ready for Docker and even there is a [example repository](https://github.com/verdaccio/docker-examples) you can use to set up your composite. The [most common configuration](https://github.com/verdaccio/docker-examples/tree/master/nginx-verdaccio) is as a proxy through **nginx** would looks like as follow:

```
version: '2'

services:
  verdaccio:
    image: verdaccio/verdaccio:latest
    container_name: verdaccio
    ports:
      - "4873:4873"
    volumes:
      - verdaccio:/verdaccio

  nginx:
    restart: always
    build: ./conf/nginx/
    ports:
      - "80:80"
    volumes:
      - /www/public
    volumes_from:
      - verdaccio
    links:
      - verdaccio:verdaccio

volumes:
  verdaccio:
    driver: local
```

and the nginx configuration

```
server {
  listen 80 default_server;
	access_log /var/log/nginx/verdaccio.log;
	charset utf-8;
  location / {
    proxy_pass              http://verdaccio:4873/;
    proxy_set_header        Host $host;
  }
}
```

Composite your Docker containers with Verdaccio is quite easy, also the configuration is minimal. If you need a more complex solution you may extend the default configuration and set an external volume as I [described in other examples](https://github.com/verdaccio/docker-examples/tree/master/docker-local-storage-volume).

## Wrap

Verdaccio is not he unique solution available, others have also some sort of OSS support. But not all is completely free. Verdaccio inherits from Sinopia [the plugin ecosystem for authentication](https://github.com/verdaccio/verdaccio/blob/master/wiki/plugins.md#sinopia-legacy-plugins) which is completely free an compatible with LDAP, Active Directory or Atlassian Crowd.

[local-npm](https://github.com/local-npm/local-npm) seems a quite good solution if you need only a offline proxy. [codebox-npm](https://github.com/craftship/codebox-npm) if you ony rely on Github auth and AWS as a platform and [Nexus3](https://www.sonatype.com/nexus-repository-oss) when you need to scale properly.

Perhaps you have in mind more use cases, I tried to select those that are the most common based on my experience as a maintainer and what people asked. Please, feel free to share your thoughts.

[http://www.verdaccio.org/](http://www.verdaccio.org/)













