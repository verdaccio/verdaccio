---
id: contributing
title: "Współtworzenie Verdaccio"
---
First of all Zapoznanie się z obcą podstawą kodowania nie jest łatwe, ale jesteśmy tutaj, aby Ci z tym pomóc.

## Kanały komunikacji

Jeżeli masz jakieś pytania, używamy dwóch kanałów do dyskusji:

* [Publiczny kanał Discord](http://chat.verdaccio.org/)

## Pierwsze kroki

Na pierwszy rzut oka verdaccio jest pojedyńczym repozytorium, lecz jest wiele sposobów, dzięki którym możesz z nami współpracować i wiele technik do przećwiczenia.

### Znajdowanie swojej mocnej strony

Wszyscy posiadamy różne umiejętności, więc zobaczmy w czym czujesz się komfortowo.

### Znam lub chcę się nauczyć Node.js

Node.js jest podstawą `verdaccio`, używamy bibliotek takich jak `express`, `commander`, `request` lub `async`. Verdaccio is basically a Rest API that create a communication with `npm` clients compatible, as `yarn`.

Posiadamy długą [listę wtyczek](plugins.md) gotową do użycia oraz rozwijania, ale również możesz [stworzyć swoją własną](dev-plugins.md).

### Wolę pracować w interfejsie użytkownika

Od niedawna zaczęliśmy używać nowoczesnych technologii, takich jak `React` oraz `element-react`. Z niecierpliwością oczekujemy nowych pomysłów na ulepszenie interfejsu użytkownika.

### I feel more confortable improving the stack

Of course, we will be happy to help us improving the stack, you can upgrade dependencies as `eslint`, `stylelint`, `webpack`. You might merely improve the `webpack` configuration would be great. Wszelkie propozycje są mile widziane. Ponadto, jeśli masz doświadczenie z **Yeoman** możesz nam pomóc z [generatorem verdaccio](https://github.com/verdaccio/generator-verdaccio-plugin).

Tutaj jest kilka pomysłów:

* Create a common eslint rules to be used across all dependencies or plugins
* Improve Flow types definitions delivery
* Moving to Webpack 4
* Improve hot reload with Webpack
* We use babel and webpack across all dependencies, why not a common preset?
* Improve continous integration delivery

### Robię świetne dokumentacje

Wiele współtwórców znajduje literówki i błędy gramatyczne, to również przyczynia się do ogólnego wrażenia podczas rozwiązywania problemów.

### Jestem projektantem

We have a frontend website <http://www.verdaccio.org/> that will be happy to see your ideas.

Nasza strona internetowa jest oparta o [Docusaurus](https://docusaurus.io/).

### I am a DevOps

We have a widely popular Docker image <https://hub.docker.com/r/verdaccio/verdaccio/> that need maintenance and pretty likely huge improvements, we need your knowledge for the benefits of all users.

Wspieramy **Kubernetes**, **Puppet**, **Ansible** i **Chef** oraz potrzebujemy pomocy tych dziedzinach, nie krępuj się sprawdzić wszystkie repozytoria.

### Mogę tłumaczyć

Verdaccio chce być wielojęzyczny, w tym celu **mamy niesamowitą pomoc** ze strony serwisu [Crowdin](https://crowdin.com), który jest świetną platformą do tłumaczeń.

<img src="https://d3n8a8pro7vhmx.cloudfront.net/uridu/pages/144/attachments/original/1485948891/Crowdin.png" width="400px" />

Przygotowaliśmy projekt, w którym możesz wybrać swój ulubiony język, jeśli nie znalazłeś tam swojego języka, nie wahaj się powiadomić nas o tym poprzez [wysłanie zgłoszenia](https://github.com/verdaccio/verdaccio/issues/new).

[Przejdź do Verdaccio na platformie Crowdin](https://crowdin.com/project/verdaccio)

## Jestem gotowy do współtworzenia

Jeśli myślisz *"Widziałem już [repozytoria](repositories.md) i jestem gotów zacząć od razu"*, wtedy mam dla Ciebie dobrą wiadomość, która znajduje się w następnym kroku.

You will need learn how to build, [we have prepared a guide just for that](build.md).

Gdy zapoznasz się ze wszystkimi skryptami i będziesz wiedział jak ich używać, będziesz gotów do następnego kroku, uruchom [**Test jednostek**](test.md).

## Pełna lista współtwórców. Chcemy tutaj zobaczyć Twoją twarz !

<a href="graphs/contributors"><img src="https://opencollective.com/verdaccio/contributors.svg?width=890&button=false" /></a>
