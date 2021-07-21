---
author: Juan Picado
authorURL: https://twitter.com/jotadeveloper
authorFBID: 1122901551
title: The crazy story of Verdaccio
---

It’s not the first time that I’ve heard the following expression “Thanks for creating Verdaccio”, which actually flatters me, but is really hard to explain in a couple of words that **I haven’t created Verdaccio**. Perhaps I might be responsible for what is Verdaccio today, but that is a different story. Today I’d like to share the whole story behind this project and how I ended up working on it.

### Sinopia “The Origin” {#sinopia-the-origin}

A few years ago in 2013, the main registry _(npmjs)_ was running for a while and at the same time, [Alex Kocharin](https://github.com/rlidwka) decided to create Sinopia.

The original objective was to create a Private registry and Cache to reduce latency between **npmjs** and the private registry. By that time **npmjs** was starting to [struggle with their own performance issues](https://blog.npmjs.org/post/97261727560/npm-inc-and-scalenpm) and be able to host private packages were _not supported yet_.

import { Tweet } from "react-twitter-widgets"

<Tweet tweetId="475058595034181632" options={{
  dnt: true,
  align: 'center'
}} />

<!--truncate-->

In fact **, Sinopia was created before** [**the big npm fall**](https://nodejs.org/en/blog/npm/2013-outage-postmortem/#what-went-wrong-and-how-was-it-fixed) **of November 4th** and much after the first registry was running. That incident put on the spotlight that having a packages _proxy/cache_ registry in-house makes total sense, at the same time the project evolved adding interesting features as _scopes packages, search on UI, plugins, override public packages_ etc.

It was clear the project was growing, but something happened in **October 2015** where is the date of the latest commit and Alex which is still the current owner decided do not reply to anyone anymore, the reasons are unknown and seem will remain like that forever _(he has recent activity in other projects)_ and **since is the unique owner the project remains frozen.**

### Post-sinopia Era {#post-sinopia-era}

![](https://cdn-images-1.medium.com/max/779/1*t8GSq1qq6RC4iQsx1bYDgg.png)

Early 2016 [the Sinopia community started to wonder](https://github.com/rlidwka/sinopia/issues/376) why so that such good idea with good support just stopped for no reason.

A few months later forks did not take long to appear. The most prominent forks were the following _(I’m aware there were much more than these)_:

![](https://cdn-images-1.medium.com/max/700/1*AlByG_WIbkxp6W9OH0JYzQ.png)

- [**Sinopia2**](https://github.com/fl4re/sinopia): Maybe the most affordable and updated fork which seems to be intended with the idea to merge some [PR were in the queue](https://github.com/rlidwka/sinopia/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+dead#issuecomment-197239368). Still, today seems on having some development but no further new features.
- [**shimmerjs/sinopia**](https://github.com/shimmerjs/sinopia): A try from IBM team contributors to provide sinopia with CouchDB support. They did a couple of releases but no much development since the fork _(this idea was a PR at Verdaccio for a long time but never was merged)_.
- [**npm-register**](https://github.com/jdxcode/npm-register): A inspired sinopia fork but created from scratch focused as to be hosted on PaaS services.
- **verdaccio** : And here is where all started, the 0 km started on 5 April 2016 which the “baptism” by [**cuzzinz**](https://github.com/cuzzinz) suggesting the name that he read on Wikipedia.

> Since it will be a fork, follow the subject the original project used but a new “color.” …. verdaccio

### Verdaccio as fork {#verdaccio-as-fork}

After a couple of months without anyone taking the wheel of the ship [John Wilkinson](https://github.com/jmwilkinson) and [Trent Earl](https://github.com/trentearl) created the Verdaccio organization on **April 2016**.

![](https://cdn-images-1.medium.com/max/797/1*AIbetKbnOhE9lVJIJO7ZnQ.png)<figcaption>Trend Earl announcing the fork of Sinopia</figcaption>

Originally the project was just another fork but soon started to receive the updates from the PR were in hold in _sinopia_ for a long time and even changes committed on _Sinopia2_. There was a feeling of lack of commitment and confusion with all the forks, somehow this issue was well addressed by the Verdaccio authors providing a second breath to the project.

**And here is where I came in.** August 2016 is where I started to contribute as anyone else, my initial role was to fix the unit testing on Node 6 and stabilize the project in a couple of areas helping _Trend_ to answer questions on the forum and work side to side to release the first stable version of Verdaccio **v2.0.0** which was the first try to put some order in the project.

> If you ask me why I decided to contribute Verdaccio. The reason is I liked the name.

During the _fall of 2016_ and beginning of 2017, we noticed more adoption and bug reports, but in February 2017 **the original authors gave me the ownership of Verdaccio** just before v2.1.1 release and they have stepped away of development and currently are just watcher. Nowadays I still feel super happy and grateful for the opportunity to drive this project.

> As a side note, in that time, my experience with Node.js was not far away from beginner level even if I had good JS background (I’m a front-end developer until today in my private work experience), I’ve never had the chance to work with Node.js in any workplace, funny huh 😅?. What I learnt about real Node.js development is 100% due Verdaccio and reading open source code.

During early **2017** the project had only ~600 stars and I started to coordinate new contributions and a progressive migration to a modern codebase. I have to highlight the new ideas [Meeeeow](https://github.com/Meeeeow) that brought to the project as semantic commits, the new UI based on React and other interesting things.

When you fork a project GitHub **reduces the visibility on Google and Github searches** , for that reason [I asked Github about it](https://github.com/verdaccio/verdaccio/issues/75#issuecomment-290631295). They kindly removed the fork label that we had for 1 year in our main repository.

![](https://cdn-images-1.medium.com/max/301/1*EF5a7ODsYd3OLMWbVQk37A.png)<figcaption>The official logo provided by the community</figcaption>

2017 ended with a decent amount of stars (~1,200), thousands of downloads and a [new logo](https://github.com/verdaccio/verdaccio/issues/328), but still, _we were not able to do a major release_. There were too much to do and lack of knowledge in many areas.

#### Docker {#docker}

By that time, Docker was new for me until I saw the first time the Dockerfile and was getting so many tickets related with such topic that forced me to learn really quick to be able to merge contributions which were Chinese for me, what did I do?. **Go to Docker meetups and read books. Problem solved.** Thankfully the community has a lot of knowledge to share in this area thus I had the opportunity to learn from amazing contributions. **Nowadays Docker is the most popular way to use Verdaccio** even over the _npm_ installation.

### 2018 “the year” {#2018-the-year}

![](https://cdn-images-1.medium.com/max/804/1*77nCfVH9qaQbP1dBkAXBMg.png)<figcaption>Verdaccio overpass sinopia on stars December 2018</figcaption>

I have to admit 2018 was super crazy since the first month the project got really good news and advertised by someone really popular (yeah, that helps a lot) Thanks [Dan Abramov](https://medium.com/u/a3a8af6addc1). **create-react-app** started to use as E2E tooling, which was totally new for me that scenario and changed our perspective of this project, later on, followed by another projects as **Storybook, pnpm, Eclipse Theia, Hyperledger or Modzilla Neutrino**.

At the same time, we released a [new website](https://verdaccio.org/) at the beginning of the year which nowadays is insanely popular and has reduced the questions over Github being for users the first line of information, by the way, we were one of the early adopters of **Docusaurus**. Thanks to [Crowdin](https://crowdin.com/project/verdaccio) that have provided a platform for translation and nowadays the community has released 7 full translations of our documentation.

![](https://cdn-images-1.medium.com/max/867/1*v-dZShJE4VVgF4fbKMtkBA.png)<figcaption>the rate of visits by country on google analytics</figcaption>

By that time a new contributor was getting super active since 2017, [Ayush](https://medium.com/u/ffdb15785e37) which was using Verdaccio at work. In the beginning, his feedback was useful for real-time usage and nowadays **he is also one of the authors for the success of this project in 2018**.

After some crazy months working really hard, we manage at May to [release Verdaccio 3](https://dev.to/verdaccio/verdaccio-3-released--4m8d-temp-slug-2596361). That gave us a small pause to rethink what to do as future steps and how to improve our community.

Also, we have boarded [Sergio Herrera Guzmán](https://medium.com/u/5609d55238ab) and [Priscila Oliveira](https://medium.com/u/c1899129305b) that have demonstrated a lot of interest about Verdaccio contributing with awesome features as the new release pipeline and the new UI which will be released in 2019. **The project currently has ~150 contributors and we are welcoming the new ones with open arms**.

I’ve seen [written articles about Verdaccio in multiple languages](https://github.com/verdaccio/verdaccio/wiki#articles), [conference speakers recommending](https://youtu.be/q4XmAy6_ucw) the usage of Verdaccio, generous [donations](https://opencollective.com/verdaccio) and our [chat](http://chat.verdaccio.org/) at Discord more active than ever.

To finish the story and ending 2018 we have created what we defined as the core team, a small group of developers trying to work together in [the development of Verdaccio 4](https://dev.to/verdaccio/verdaccio-4-alpha-release-1d7p-temp-slug-4609102).

### Current Status {#current-status}

If you wonder how the “governance” works at Verdaccio, we do it in the following way. **We have 4 owners** (the founders, [Juan Picado](https://medium.com/u/a6a7b0f6a9e4), [Ayush](https://medium.com/u/ffdb15785e37)) which we open communication when something important should take place and we ship an internal report every 6 months at GitHub teams threads. We have decided this structure in order to avoid what happened with Sinopia do not happen again. The development decisions are taking at the core team level based on democracy and common sense.

The development communication happens over Discord and **we started to encourage code reviews and open discussions about everything**. For now, it works, but we are trying to evolve the process and improve it.

Currently, we are working on improving the documentation and create a clean ecosystem of plugins, integrations and new ways to inform, teach new adopters about the usage of the registry and helping to board new contributors that want to be part of the development.

### Wrapping Up {#wrapping-up}

As you have read, Verdaccio is not a one author project. **It’s a collaboration of many developers that decided don’t let this project die**. I always like to think the following if you allow me [to quote a simile famous words of Abraham Lincoln](https://en.wikipedia.org/wiki/Gettysburg_Address)

> Verdaccio is a project of the community, by the community and for the community.

I’m driving this project today, but does not means I’ll do it forever. I like to share responsibilities with others because **nobody is working on Verdaccio full time** as it happens with other open source projects.

**We want this project alive, updated and as reliable, open source and free option for everybody**. Following the principles of sinopia stablished as simplicity, zero configuration and with the possibility to extend it.

Even if some initial developers are not contributing anymore _(all we have a life)_, I’m really grateful for the time they have invested and hoped they back in some point.

### Disclaimer {#disclaimer}

I’m telling this story based on my own research and all the information collected along the latest 2 years, comments, private chats, and social networks.

---
