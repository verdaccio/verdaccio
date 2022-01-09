/**
 * Not used at this moment, but I'll leave it here for future usage.
 * Ref https://github.com/verdaccio/verdaccio/pull/2253#discussion_r632052482
 */
module.exports = {
  name: `plugin-postinstall`,
  factory: () => ({
    hooks: {
      beforeWorkspacePacking(_workspace, data) {
        if ('scripts' in data && 'postinstall' in data.scripts) {
          delete data.scripts.postinstall;
        }
      },
    },
  }),
};
