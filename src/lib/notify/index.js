import Handlebars from 'handlebars';
import _ from 'lodash';

import {notifyRequest} from './notify-request';

export function handleNotify(metadata, notifyEntry, publisherInfo, publishedPackage) {
  let regex;
  if (metadata.name && notifyEntry.packagePattern) {
    regex = new RegExp(notifyEntry.packagePattern, notifyEntry.packagePatternFlags || '');
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

  return notifyRequest(options, content);
}

export function sendNotification(metadata, key, ...moreMedatata) {
  return handleNotify(metadata, key, ...moreMedatata);
}

export function notify(metadata, config, ...moreMedatata) {
  if (config.notify) {
    if (config.notify.content) {
      return sendNotification(metadata, config.notify, ...moreMedatata);
    } else {
      // multiple notifications endpoints PR #108
      return Promise.all(_.map(config.notify, (key) => sendNotification(metadata, key, ...moreMedatata)));
    }
  }

  return Promise.resolve();
}
