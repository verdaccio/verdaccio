---
id: ifisapo iranti
title: "Awọn ọna ifisapo iranti"
---

Verdaccio n se ipamọ gbogbo awọn akopọ ni atilẹwa sinu foda `/storage`. Ṣugbọn o le se ipinnu boya o fẹ tẹle ọna ti o yatọ. Lilo awọn ohun elo o le lo ipamọ ayelujara tabi eyikeyi iru ibi ipamọ data.

## Awọn iṣẹlẹ ifisapo iranti

* Build a Node.js project on **Continous Integration** (Bamboo, GitLab, Jenkins, etc) servers is a task that might take several times at a day, thus, the server will download tons of tarballs from the registry every time takes place.  Bi ti gbogbo igba, awọn irinṣẹ CI n pa ibi iranti rẹ lẹhin agbedide kọọkan atipe ilana naa yoo pada bẹrẹ lati ibẹrẹ pẹpẹ lẹẹkansi. Eyi jẹ ibudanu ti itankanlẹ atipe o n mu adinku abẹwo to n ti ita wa. **You can use Verdaccio for caching tarballs and metadata in our internal network and give a boost in your build time.**
* **Latency and Connectivity**, not all countries enjoy a high-speed connection. Fun iru idi yii awọn akopọ ibi iranti ti ibilẹ ninu nẹtiwọki rẹ jẹ eyi to wulo gan. Boya ti o ba wa ni irin-ajo, tabi o ni asopọ alailagbara, ilọkiri tabi awọn orilẹ-ede ti o ni awọn aabo ayelujara ti o lagbara ti o le ni ipa lori iriri olumulo (fun apẹẹrẹ: tarballs bibajẹ).
* **Offline Mode**, all Node Package Managers nowadays uses their own internal cache, but it common that different projects might use different tools, which implies lock files and so on. Awọn irinṣẹ yẹn ko ni anfani lati pin ibi iranti, ojutu to dayatọ naa jẹ eyi to wa lojukan atipe o gbẹkele ibi iforukọsilẹ aṣoju ikọkọ, Verdaccio n se ipamọ gbogbo awọn metadata ati awọn tarballs n jẹ gbigba lati ayelujara nipa ibeere nini anfani lati pin wọn kaakiri gbogbo isẹ rẹ.
* Avoid that any remote registry suddenly returns *HTTP 404* error for tarballs were previously available a.k.a ([left-pad issue](https://www.theregister.co.uk/2016/03/23/npm_left_pad_chaos/)).


# Awọn ọna fun ṣiṣe awọn agbedide kiakia

> A n wa awọn ọna diẹ sii, ma se siyemeji lati pin iriri rẹ ni aaye yii

## Yago fun Fifi tarballs sapo iranti

Ti o ba ni aaye ibi ipamọ ti o lopin, o le nilo lati yago fun titọju tarballs, siseto `cache` false ninu uplink kọọkan ma ṣe ipamọ iranti awọn faili metadata nikan.

```
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
    cache: false
```

## Fifa Akoko Ipari Apo iranti gun

 Verdaccio ni atilẹwa ma n duro fun iṣẹju meji lati fagilee awọn metadata apo iranti ki o to sawari alaye tuntun lati ibi iforukọsilẹ ọlọna jijin.

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
    maxage: 30m
```

Sise alekun iye ti `maxage` ninu awọn idari `uplink` kọọkan maa jẹ bibeere nigbagbogbo. Eyi le jẹ ilana to fẹsẹmulẹ ti o ko ba maa ṣe imudojuiwọn awọn agbẹkẹle nigbagbogbo.


## Lilo iranti dipo lilo ààyè ìtọ́jú lórí kọ̀mpútà

Nigbamiran awọn akopọ ifisapo iranti o kin ṣe igbesẹ pataki, dipo ti ọna awọn akopọ lati awọn ibi iforukọsilẹ ti o yatọ ati nini iyọrisi awọn akoko agbedide to yara. Awọn ohun elo afikun meji wa to yago patapata fun kikọ sinu ààyè ìtọ́jú alafojuri ti kọ̀mpútà nipa lilo iranti.

```bash
  npm install -g verdaccio-auth-memory
  npm install -g verdaccio-memory
```

Iṣeto naa ribi iru eyi

```yaml
auth:
  auth-memory:
    users:
      foo:
        name: test
        password: test
store:
  memory:
    limit: 1000
```

Ranti, ni kete ti olupese naa ba ti jẹ atunbẹrẹ ipadanu data naa ti n waye, a ṣe igbaniyanju iṣeto yii ni awọn aaye ti o ko ba ti nilo lati ṣe atẹnumọ.
