---
id: awọn igbesẹ-github
title: "GitHub Actions"
---

Pẹlu [Awọn igbesẹ Github](https://github.com/features/actions) o le ṣe ilana iṣẹ rẹ ni aifọwọyi, Igbesẹ Github kọọkan n ṣe igbesẹ kan ni pato ninu ilana kan.

![awọn igbesẹ](/img/github-actions.png)

## Sisedanwo awọn akopọ rẹ

Verdaccio provides a custom action for easy integration in your flow by adding the following to your workflow file's `steps` key.

```yaml
- name: Publish with Verdaccio
  uses: verdaccio/github-actions/publish@master
```

The action will perform a `npm publish` and if the publishing finishes successfully, the workflow will continue to the next step, otherwise the step will fail. If there are any issues publishing a package you will notice using this action.

Laarin aworan `verdaccio-auth-memory` ati `verdaccio-memory` lo awọn ohun elo lati sakoso sise ifasẹsi ati ipamọ lati mu ki ilana na yara si.

Ti o ba fẹ mọ sii nipa igbesẹ naa, [lọ si ibi ipamọ wa](https://github.com/verdaccio/github-actions) ti a gbekalẹ fun Awọn igbesẹ GitHub.
