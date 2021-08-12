module.exports = {
  onPreBuild: async ({ utils: { build, run } }) => {
    try {
      await run.command("npm install -g pnpm")
      await run.command("pnpm install --ignore-scripts --frozen-lockfile")
    } catch (error) {
      return build.failBuild(error)
    }
  }
}
