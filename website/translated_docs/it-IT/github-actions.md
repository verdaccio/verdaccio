---
id: github-actions
title: "GitHub Actions"
---

Con [GitHub Action](https://github.com/features/actions) è possibile automatizzare il workflow, ciascuna GitHub Action esegue un passaggio specifico in un processo.

![actions](/img/github-actions.png)

## Testare i pacchetti

Verdaccio provides a custom action for easy integration in your flow by adding the following to your workflow file's `steps` key.

```yaml
- name: Publish with Verdaccio
  uses: verdaccio/github-actions/publish@master
```

The action will perform a `npm publish` and if the publishing finishes successfully, the workflow will continue to the next step, otherwise the step will fail. If there are any issues publishing a package you will notice using this action.

All'interno dell'immagine utilizza i plugin `verdaccio-auth-memory` e `verdaccio-memory` per gestire l'autenticazione e l'archiviazione per velocizzare il processo.

Se si desidera sapere di più sull'azione, [visitare il nostro repository](https://github.com/verdaccio/github-actions) dedicato alle GitHub Action.
