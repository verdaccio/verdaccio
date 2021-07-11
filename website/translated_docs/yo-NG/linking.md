---
id: sise asopọ-ibi iforukọsilẹ-ọlọna jijin
title: "Sise asopọ ibi iforukọsilẹ ọlọna jijin kan"
---

Verdaccio jẹ aṣoju ikọkọ ati nipa atilẹda [n se asopọ](uplinks.md) ibi iforukọsilẹ ti gbogbogbo.

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```

O le ṣe asopọ awọn ibi iforukọsilẹ ọlọpọlọpọ, iwe wọnyii yoo ṣe atọkun rẹ bi iranlọwọ diẹ lara awọn iṣeto.

## Lilo Ilana ti Alabasepọ

Ọna ara lati wọle si awọn ibi iforukọsilẹ ọlọpọlọpọ nipa lilo `.npmrc` jẹ ilana ẹya ara bi atẹle yii:

```
// .npmrc
registry=https://registry.npmjs.org
@mycompany:registry=http://localhost:4873
```

Ọna yii fẹsẹmulẹ, ṣugbọn o wa pẹlu ọpọlọpọ awọn akude:

* O **n ṣiṣẹ pẹlu awọn scope nikan**
* Scope gbọdọ baramu, **ko si igbalaaye fun Awọn ifarahan Yẹpẹrẹ kankan**
* Scope kan **kole sawari lati awọn ibi iforukọsilẹ ọlọpọlọpọ**
* Awọn aami/awọn ọrọ igbaniwọle **gbọdọ wa ni asọye laarin** `.npmrc` atipe jẹ gbigbe wọle sinu ibi ipamọ naa.

Wo apẹẹrẹ kikun kan [nibi](https://stackoverflow.com/questions/54543979/npmrc-multiple-registries-for-the-same-scope/54550940#54550940).

## Sise asopọ Ibi iforukọsilẹ kan

Sise asopọ ibi iforukọsilẹ kan rọrun gan. Lakọkọ, ṣe asọye abala tuntun kan ni abala ti `uplinks`. Akiyesi, eto ti ibi ko ṣe pataki.

```yaml
  uplinks:
    private:
      url: https://private.registry.net/npm

    ... [truncated] ...

  'webpack':
    access: $all
    publish: $authenticated
    proxy: private

```

Se afikun abala `aṣoju ikọkọ` lati seto ibi iforukọsilẹ to jẹ yiyan ti o fẹ lati se ni aṣoju ikọkọ.

## Siṣe asopọ Awọn ibi iforukọsilẹ ọlọpọlọpọ

```yaml
  uplinks:
    server1:
      url: https://server1.registry.net/npm
    server2:
      url: https://server2.registry.net/npm

    ... [truncated] ...

  'webpack':
    access: $all
    publish: $authenticated
    proxy: server1 server2
```

Verdaccio n ṣe atilẹyin fun awọn ibi iforukọsilẹ ọlọpọlọpọ lori aaye `aṣoju ikọkọ`. Ibeere ​​naa yoo jẹ yiyanju pẹlu alakọkọ ninu akojọ naa; to ba jẹ pe iyẹn kuna, o ma gbiyanju pẹlu eyi tókàn ninu akojọ naa ati bẹbẹ lọ.

## Ibi iforukọsilẹ Alaisilorila

Nini Ibi iforukọsilẹ Alaisilorila kikun jẹ eyi to ṣeeṣe patapata. Ti o ko ba fẹ asopọmọ eyikeyi pẹlu awọn idari ti ita o le ṣe awọn wọnyii.

```yaml

auth:
  htpasswd:
    file: ./htpasswd
uplinks:
packages:
  '@my-company/*':
    access: $all
    publish: none
  '@*/*':
    access: $all
    publish: $authenticated
  '**':
    access: $all
    publish: $authenticated
```

Yọ gbogbo `aṣoju ikọkọ` awọn aaye laarin abala kọọkan ti `awọn akopọ`. Ibi iforukọsilẹ naa yoo di kikun ni aisilorila.
