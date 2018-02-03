import HTTPError from 'http-errors';
import {combineBaseUrl, getWebProtocol} from '../../../lib/utils';

function addUserAuthApi(route, auth, config) {
  route.post('/login', function(req, res, next) {
    auth.authenticate(req.body.username, req.body.password, (err, user) => {
      if (!err) {
        req.remote_user = user;

        next({
          token: auth.issue_token(user, '24h'),
          username: req.remote_user.name,
        });
      } else {
        next(HTTPError[err.message ? 401 : 500](err.message));
      }
    });
  });

  route.post('/-/logout', function(req, res, next) {
    const base = combineBaseUrl(getWebProtocol(req), req.get('host'), config.url_prefix);

    res.cookies.set('token', '');
    res.redirect(base);
  });
}

export default addUserAuthApi;
