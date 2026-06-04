/**
 * Test-only middleware plugin used to assert that middleware plugins can read
 * `req.remote_user`, which is only true when the JWT middleware runs *before*
 * the middleware plugins are registered (see PR #5697 / issue #5167).
 */
module.exports = function () {
  return {
    register_middlewares(app) {
      app.get('/-/remote-user-probe', (req, res) => {
        const remoteUser = req.remote_user;
        res.status(200).json({
          hasRemoteUser: Boolean(remoteUser),
          name: remoteUser ? (remoteUser.name ?? null) : null,
          groups: remoteUser ? (remoteUser.groups ?? null) : null,
        });
      });
    },
  };
};
