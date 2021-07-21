---
id: github-actions
title: "GitHub Actions"
---

With [GitHub Actions](https://github.com/features/actions) you can automate your workflow, each GitHub Action performs a specific step in a process.

![actions](/img/github-actions.png)

## Testing your packages {#testing-your-packages}

Verdaccio provides a custom action for easy integration in your flow by adding the following to your workflow file's `steps` key.

```yaml
- name: Publish with Verdaccio
  uses: verdaccio/github-actions/publish@master
```

The action will perform a `npm publish` and if the publishing finishes successfully, the workflow will continue to the next step, otherwise the step will fail.
If there are any issues publishing a package you will notice using this action.

Within the image uses `verdaccio-auth-memory` and `verdaccio-memory` plugins to handle authentification and storage to speed up the process.

If you want to know more about the action, [visit our repository](https://github.com/verdaccio/github-actions) dedicated for GitHub Actions.
