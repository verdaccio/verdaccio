---
id: uplinks
title: "Uplinks"
---

*uplink* jẹ ọna asopọ pẹlu ibi iforukọsilẹ ti ita ti o n pese iwọle si awọn akojọ ti ita.

![Uplinks](https://user-images.githubusercontent.com/558752/52976233-fb0e3980-33c8-11e9-8eea-5415e6018144.png)

### Ilo

```yaml
uplinks:
  npmjs:
   url: https://registry.npmjs.org/
  server2:
    url: http://mirror.local.net/
    timeout: 100ms
  server3:
    url: http://mirror2.local.net:9000/
  baduplink:
    url: http://localhost:55666/
```

### Iṣeto

O le ṣe asọye awọn uplink ọlọpọlọpọ atipe ọkọọkan wọn gbọdọ ni orukọ to dayatọ (kọkọrọ). Wọn le ni awọn ohun wọnyi:

| Ohun ini        | Iru     | Ti o nilo | Apẹẹrẹ                                  | Atilẹyin | Apejuwe                                                                                                                                                                  | Atilẹwa          |
| --------------- | ------- | --------- | --------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| url             | okun    | Bẹẹni     | https://registry.npmjs.org/             | gbogbo   | url ibi iforukọsilẹ naa                                                                                                                                                  | npmjs            |
| ca              | okun    | Rara      | ~./ssl/client.crt'                      | gbogbo   | iwe ẹri ipa ọna SSL                                                                                                                                                      | Kosi atilẹda     |
| akoko idawọduro | okun    | Rara      | 100ms                                   | gbogbo   | ṣeto akoko idawọduro tuntun fun ìbéèrè naa                                                                                                                               | 30s              |
| maxage          | okun    | Rara      | 10m                                     | gbogbo   | akoko aala si apo iranti naa fẹsẹmulẹ                                                                                                                                    | 2m               |
| fail_timeout    | okun    | Rara      | 10m                                     | gbogbo   | n ṣe asọye akoko gigaju nigba ti ìbéèrè ma di ikuna                                                                                                                      | 5m               |
| max_fails       | nọmba   | Rara      | 2                                       | gbogbo   | se adinku iye ibeere ikuna to pọju                                                                                                                                       | 2                |
| apo iranti      | boolean | Rara      | [otitọ, irọ]                            | >= 2.1   | ko gbogbo awọn tarball ọna jijin si ipamọ apo iranti                                                                                                                     | otitọ            |
| auth            | akojọ   | Rara      | [wo isalẹ](uplinks.md#auth-property)    | >= 2.5   | n yan akọle 'Authorization' naa [alaye siwaju sii](http://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules)                                           | o ti jẹ yiyọkuro |
| awọn akọle      | akojọ   | Rara      | authorization: "Bearer SecretJWToken==" | gbogbo   | akojọ awọn akọle akanṣe fun uplink naa                                                                                                                                   | o ti jẹ yiyọkuro |
| strict_ssl      | boolean | Rara      | [otitọ, irọ]                            | >= 3.0   | To ba jẹ otitọ, o nilo ki awọn iwe ẹri SSL fẹsẹmulẹ.                                                                                                                     | otitọ            |
| agent_options   | object  | Rara      | maxSockets: 10                          | >= 4.0.2 | options for the HTTP or HTTPS Agent responsible for managing uplink connection persistence and reuse [more info](https://nodejs.org/api/http.html#http_class_http_agent) | Kosi atilẹda     |

#### Ohun ini Auth

Ohun ini `auth` fun ọ laaye lati lo aami auth kan pẹlu uplink. Lilo iyipada ayika atilẹwa naa:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token_env: true # defaults to `process.env['NPM_TOKEN']`
```

tabi nipasẹ iyipada ayika to jẹ yiyan:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token_env: FOO_TOKEN
```

`token_env: FOO_TOKEN`labẹnu ma lo `process.env['FOO_TOKEN']`

tabi nipa yiyan aami kan taarata:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token: "token"
```

> Akiyesi: `token` ṣe pataki ju `token_env` lọ

### O Gbọdọ Mọ

* Uplinks gbọdọ ni ibamu pẹlu awọn ibi iforukọsilẹ pẹlu `npm` awọn aaye opin. Fun apẹẹrẹ: *verdaccio*, `sinopia@1.4.0`, *npmjs registry*, *yarn registry*, *JFrog*, *Nexus* ati siwaju sii.
* Ṣiṣeto `cache` si eke yoo ṣe iranlọwọ lati pa aaye mọ ninu ààyè ìtọ́jú alafojuri rẹ. Eyi yoo yago fun itọju `tarballs` sugbọn [o ma fi metadata pamọ sinu awọn foda](https://github.com/verdaccio/verdaccio/issues/391).
* Titayọ pẹlu ọpọlọpọ uplinks le mu ifasẹyin ba isawari awọn akopọ rẹ ti o ti yẹ fun ibeere kọọkan ti onibara npm kan ṣe, verdaccio n ṣe ipe 1 fun uplink kọọkan.
* Ilana (timeout, maxage and fail_timeout) tẹle [awọn odiwọn iwọn NGINX](http://nginx.org/en/docs/syntax.html)