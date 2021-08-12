// @ts-check
/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  docs: [
    {
      type: "category",
      label: "Introduction",
      items: [
        "what-is-verdaccio",
        "installation",
        "cli",
        "cli-registry",
        "who-is-using",
        "best",
        "protect-your-dependencies",
        "security-policy",
        "logo",
        {
          type: "category",
          label: "Uses Cases",
          items: ["e2e", "caching", "github-actions", "linking-remote-registry"]
        },
        {
          type: "category",
          label: "Talks & Articles",
          items: ["articles", "talks"]
        },
      ]
    },
    {
      type: "category",
      label: "Features",
      items: [
        "configuration",
        "uplinks",
        "packages",
        "authentication",
        "notifications",
        "logger",
        "webui"
      ]
    },
    {
      type: "category",
      label: "Server",
      items: [
        "server-configuration",
        "reverse-proxy",
        "ssl",
        "windows",
        "iss-server"
      ]
    },
    {
      type: "category",
      label: "Development",
      items: [
        "plugins",
        "dev-plugins",
        {
          type: "category",
          label: "Dev Guides",
          items: ["plugin-generator", "plugin-auth", "plugin-middleware", "plugin-storage"]
        },
        "node-api"
      ]
    },
    {
      type: "category",
      label: "DevOps",
      items: [
        "docker",
        "kubernetes",
        "ci",
        {
          type: "category",
          label: "Cloud",
          items: ["amazon"]
        },
        {
          type: "category",
          label: "Tools",
          items: ["ansible", "puppet", "chef"]
        },
      ]
    },
    {
      type: "category",
      label: "Guides",
      items: ["aws"]
    }
  ]
};
