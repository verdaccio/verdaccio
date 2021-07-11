---
id: server-configuration
title: "Server Configuration"
---

Ово је најбазичнија конфигурација за linux server али нам се чини важним да документујемо и поделимо са Вама све кораке како би verdaccio стално радио на серверу. Биће Вам потребне root (или sudo) дозволе за наведено.

<div id="codefund">''</div>

## Покретање, као засебан корисник

Најпре креирајте verdaccio корисника:

```bash
$ sudo adduser --system --gecos 'Verdaccio NPM mirror' --group --home /var/lib/verdaccio verdaccio
```

У случају да немате постојећег корисника потребно је да га додате, `adduser`:

```bash
$ sudo useradd --system --comment 'Verdaccio NPM mirror' --create-home --home-dir /var/lib/verdaccio --shell /sbin/nologin verdaccio
```

Затим креирате shell као verdaccio корисник, путем следеће команде:

```bash
$ sudo su -s /bin/bash verdaccio
$ cd
```

Команда `cd` шаље Вас до home директоријума verdaccio корисника. Постарајте се да покренете verdaccio барем једном како бисте генерисали config фајл. Модификујте га према својим потребама.

## Listening на свим адресама

Ако желите да ослушкујете (listen to) сваку екстерну адресу, подесите listen директиву на:

```yaml
# можете подесити listen address (или порт)
listen: 0.0.0.0:4873
```

Ако имате покренут verdaccio у Amazon EC2 инстанци, [мораћете да подесите listen у change your config file](https://github.com/verdaccio/verdaccio/issues/314#issuecomment-327852203) као што је приказано у наведеном примеру.

> Конфигурисање Apache-а или nginx? Молимо Вас да погледате [Reverse Proxy Setup](reverse-proxy.md)

## Како да verdaccio ради непрекидно

Можете да користите node package звани ['forever'](https://github.com/nodejitsu/forever) како бисте имали verdaccio који ће непрекидно радити.

Прво инсталирајте `forever` глобално:

```bash
$ sudo npm install -g forever
```

Проверите да ли сте покренули verdaccio барем једном како бисте генерисали config фајл и уписали админ корисника. После тога, можете користити следећу команду како бисте покренули verdaccio:

```bash
$ forever start `which verdaccio`
```

Можете погледати документацију за више информација о томе како да користите пакет forever.

## Преживљавање ресетовања сервера

Можете истовремено користити `crontab` и `forever` како бисте ресетовали verdaccio након сваког reboot-овања сервера. Након што сте се пријавили као verdaccio корисник, задајте следеће:

```bash
$ crontab -e
```

Могуће је да ћете добити питање да одаберете едитор. Одаберите свој омиљени и наставите. Унесите следећи инпут у фајл:

    @reboot /usr/bin/forever start /usr/lib/node_modules/verdaccio/bin/verdaccio
    

Локације могу варирати у зависности од подешавања сервера. Ако желите да сазнате где се налазе Ваши фајлови, можете користити команду 'which':

```bash
$ which forever
$ which verdaccio
```

## Коришћење systemd

Уместо `forever` можете користити `systemd` за покретање verdaccio-а и одржавање његовог рада. Verdaccio инсталација поседује systemd unit, све што треба да урадите је да је копирате:

```bash
$ sudo cp /usr/lib/node_modules/verdaccio/systemd/verdaccio.service /lib/systemd/system/ && sudo systemctl daemon-reload
```

Ова јединица подразумева да имате конфигурацију у `/etc/verdaccio/config.yaml` и чува податке у `/var/lib/verdaccio`, тако да Вам остаје или да померите своје фајлове или да модификујете саму јединицу.