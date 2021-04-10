---
id: github-actions
title: "Github Actions"
---

With [GitHub Actions](https://github.com/features/actions) you can automate your workflow, each GitHub Action performs a specific step in a process.

![actions](/img/github-actions.png)

## Testing your packages

Verdaccio provides a custom action for easy integration in your flow, you only add the following to your `main.workflow` in the step you consider the better for your flow.

```gha
action "Publish Verdaccio" {
  uses = "verdaccio/github-actions/publish@master"
  args = ["publish"]
}
```

The action will perform a `npm publish` and if the publishing finishes successfully will allow to continue to the next step, otherwise will fails. If there is any issue publishing a package you will notice using this action.

Within the image uses `verdaccio-auth-memory` and `verdaccio-memory` plugins to handle authentification and storage to speed up the process.

If you want to know more about the action, [visit our repository](https://github.com/verdaccio/github-actions) dedicated for GitHub Actions.