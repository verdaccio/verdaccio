import Handlebars from 'handlebars';
import _ from 'lodash';
import { notifyRequest } from './notify-request';
import { RequestInit } from 'node-fetch';

import { Config, Package, RemoteUser } from '@verdaccio/types';

type TemplateMetadata = Package & { publishedPackage: string };

export function handleNotify(metadata: Package, notifyEntry, remoteUser: RemoteUser, publishedPackage: string): Promise<any> | void {
  let regex;
  if (metadata.name && notifyEntry.packagePattern) {
    regex = new RegExp(notifyEntry.packagePattern, notifyEntry.packagePatternFlags || '');
    if (!regex.test(metadata.name)) {
      return;
    }
  }

  const template: HandlebarsTemplateDelegate = Handlebars.compile(notifyEntry.content);
  // don't override 'publisher' if package.json already has that
  /* eslint no-unused-vars: 0 */
  /* eslint @typescript-eslint/no-unused-vars: 0 */
  // @ts-ignore
  if (_.isNil(metadata.publisher)) {
    // @ts-ignore
    metadata = { ...metadata, publishedPackage, publisher: { name: remoteUser.name as string } };
  }

  const content: string = template(metadata);


  const options: RequestInit = {
    // @ts-ignore FIX ME
    body: content,
  };

  // provides fallback support, it's accept an Object {} and Array of {}
  if (notifyEntry.headers && _.isArray(notifyEntry.headers)) {
    const header = {};
    notifyEntry.headers.map(function(item): void {
      if (Object.is(item, item)) {
        for (const key in item) {
          /* eslint no-prototype-builtins: 0 */
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

  const url:string = notifyEntry.endpoint

  return notifyRequest(url, options, content);
}

export function sendNotification(metadata: Package, notify: Notification, remoteUser: RemoteUser, publishedPackage: string): Promise<any> {
  return handleNotify(metadata, notify, remoteUser, publishedPackage) as Promise<any>;
}

export function notify(metadata: Package, config: Config, remoteUser: RemoteUser, publishedPackage: string): Promise<any> | void {
  if (config.notify) {
    if (config.notify.content) {
      return sendNotification(metadata, (config.notify as unknown) as Notification, remoteUser, publishedPackage);
    }
    // multiple notifications endpoints PR #108
    return Promise.all(_.map(config.notify, key => sendNotification(metadata, key, remoteUser, publishedPackage)));
  }

  return Promise.resolve();
}
