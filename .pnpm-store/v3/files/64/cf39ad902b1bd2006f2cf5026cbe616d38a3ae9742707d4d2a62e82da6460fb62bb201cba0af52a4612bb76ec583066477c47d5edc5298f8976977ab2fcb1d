# @changesets/get-github-info

> Get the GitHub username and PR number from a commit. Intended for use with changesets.

## Getting Started

> Note: This assumes you already have changesets setup.

To use `@changesets/get-github-info`, you'll need to install it and you'll probably also want `dotenv` to provide a GitHub personal access token via a `.env` file.

```bash
yarn add --dev @changesets/get-github-info dotenv
```

or

```bash
npm install --save-dev @changesets/get-github-info dotenv
```

Then you can use it in your `.changeset/config.js` like this.

```jsx
require("dotenv").config();
const { getInfo } = require("@changesets/get-github-info");

// ...

const getReleaseLine = async (changeset, type) => {
  const [firstLine, ...futureLines] = changeset.summary
    .split("\n")
    .map(l => l.trimRight());
  // getInfo exposes the GH username and PR number if you want them directly
  // but it also exposes a set of links for the commit, PR and GH username
  let { user, pull, links } = await getInfo({
    // replace this will your own repo
    repo: "Noviny/changesets",
    commit: changeset.commit
  });
  return `- ${links.commit}${links.pull === null ? "" : ` ${links.pull}`}${
    links.user === null ? "" : ` Thanks ${links.user}!`
  }: ${firstLine}\n${futureLines.map(l => `  ${l}`).join("\n")}`;
};

// ...
```

You'll need to [get a GitHub personal access token](https://github.com/settings/tokens/new) with `read:user` and `repo:status` permissions, and add it to a `.env` file.

```bash
GITHUB_TOKEN=token_here
```

You can now bump your packages and changelogs with `changeset bump` and it'll have the GitHub info. 🎉

## API

```ts
type Info = {
  user: string | null;
  pull: number | null;
  links: {
    commit: string;
    pull: string | null;
    user: string | null;
  };
};

type Options = {
  commit: string;
  repo: string;
};

export function getInfo(options: Options): Info {
  // magic...
}
```
