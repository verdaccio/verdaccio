import Handlebars from 'handlebars';
import request from 'request';
import _ from 'lodash';
import logger from './logger';

const handleNotify = function(metadata, notifyEntry, publisherInfo, publishedPackage) {
  let regex;
  if (metadata.name && notifyEntry.packagePattern) {
    // FUTURE: comment out due https://github.com/verdaccio/verdaccio/pull/108#issuecomment-312421052
    // regex = new RegExp(notifyEntry.packagePattern, notifyEntry.packagePatternFlags || '');
    regex = new RegExp(notifyEntry.packagePattern);
    if (!regex.test(metadata.name)) {
      return;
    }
  }

  const template = Handlebars.compile(notifyEntry.content);

  // don't override 'publisher' if package.json already has that
  if (!metadata.publisher) {
    metadata = {...metadata, publishedPackage, publisher: publisherInfo};
  }
  const content = template(metadata);

  const options = {
    body: content,
  };

  // provides fallback support, it's accept an Object {} and Array of {}
  if (notifyEntry.headers && _.isArray(notifyEntry.headers)) {
    const header = {};
    notifyEntry.headers.map(function(item) {
      if (Object.is(item, item)) {
        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            header[key] = item[key];
          }
        }
      }
    });
    options.headers = header;
  } else if (Object.is(notifyEntry.headers, notifyEntry.headers)) {
    options.headers = notifyEntry.headers;
  }

  options.method = notifyEntry.method;

  if (notifyEntry.endpoint) {
    options.url = notifyEntry.endpoint;
  }

  return new Promise((resolve, reject) => {
    request(options, function(err, response, body) {
      if (err || response.statusCode >= 400) {
        const errorMessage = _.isNil(err) ? response.body : err.message;
        logger.logger.error({errorMessage}, 'notify service has thrown an error: @{errorMessage}');

        reject(errorMessage);
      } else {
        logger.logger.info({content}, 'A notification has been shipped: @{content}');
        if (_.isNil(body) === false) {
          const bodyResolved = _.isNil(body) === false ? body : null;

          logger.logger.debug({body}, ' body: @{body}');
          return resolve(bodyResolved);
        }

        reject(Error('body is missing'));
      }
    });
  });
};

function sendNotification(metadata, key, ...moreMedatata) {
  return handleNotify(metadata, key, ...moreMedatata);
}

const notify = function(metadata, config, ...moreMedatata) {
  if (config.notify) {
    if (config.notify.content) {
      return sendNotification(metadata, config.notify, ...moreMedatata);
    } else {
      // multiple notifications endpoints PR #108
      return Promise.all(_.map(config.notify, (key) => sendNotification(metadata, key, ...moreMedatata)));
    }
  }

  return Promise.resolve();
};

export {notify};
