/* eslint-disable no-undef */

import Handlebars from 'handlebars';

import buildDebug from 'debug';
import { Config, Package, RemoteUser, Notification } from '@verdaccio/types';
import { logger } from '@verdaccio/logger';
import { notifyRequest, NotifyRequestOptions } from './notify-request';

const debug = buildDebug('verdaccio:hooks');
type TemplateMetadata = Package & { publishedPackage: string };

export function compileTemplate(content, metadata) {
  // FUTURE: multiple handlers
  return new Promise((resolve, reject) => {
    let handler;
    try {
      if (!handler) {
        debug('compile default template handler %o', content);
        const template: HandlebarsTemplateDelegate = Handlebars.compile(content);
        return resolve(template(metadata));
      }
    } catch (error) {
      debug('error  template handler %o', error);
      reject(error);
    }
  });
}

export async function handleNotify(
  metadata: Partial<Package>,
  notifyEntry,
  remoteUser: Partial<RemoteUser>,
  publishedPackage: string
): Promise<boolean> {
  let regex;
  if (metadata.name && notifyEntry.packagePattern) {
    regex = new RegExp(notifyEntry.packagePattern, notifyEntry.packagePatternFlags || '');
    if (!regex.test(metadata.name)) {
      return false;
    }
  }

  let content;
  // FIXME: publisher is not part of the expected types metadata
  // @ts-ignore
  if (typeof metadata?.publisher === 'undefined' || metadata?.publisher === null) {
    // @ts-ignore
    metadata = { ...metadata, publishedPackage, publisher: { name: remoteUser.name as string } };
    debug('template metadata %o', metadata);
    content = await compileTemplate(notifyEntry.content, metadata);
  }

  const options: NotifyRequestOptions = {
    body: JSON.stringify(content),
  };

  // provides fallback support, it's accept an Object {} and Array of {}
  if (notifyEntry.headers && Array.isArray(notifyEntry.headers)) {
    const header = {};
    // FIXME: we can simplify this
    notifyEntry.headers.map(function (item): void {
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

  if (!notifyEntry.endpoint) {
    debug('error due endpoint is missing');
    throw new Error('missing parameter');
  }

  return notifyRequest(notifyEntry.endpoint, {
    method: notifyEntry.method,
    ...options,
  });
}

export function sendNotification(
  metadata: Partial<Package>,
  notify: Notification,
  remoteUser: Partial<RemoteUser>,
  publishedPackage: string
): Promise<boolean> {
  return handleNotify(metadata, notify, remoteUser, publishedPackage) as Promise<any>;
}

export async function notify(
  metadata: Partial<Package>,
  config: Partial<Config>,
  remoteUser: Partial<RemoteUser>,
  publishedPackage: string
): Promise<boolean[]> {
  debug('init send notification');
  if (config.notify) {
    const isSingle = Object.keys(config.notify).includes('method');
    if (isSingle) {
      debug('send single notification');
      try {
        const response = await sendNotification(
          metadata,
          config.notify as Notification,
          remoteUser,
          publishedPackage
        );
        return [response];
      } catch {
        debug('error on sending single notification');
        return [false];
      }
    } else {
      debug('send multiples notification');
      const results = await Promise.allSettled(
        Object.keys(config.notify).map((keyId: string) => {
          // @ts-ignore
          const item = config.notify[keyId];
          debug('send item %o', item);
          return sendNotification(metadata, item, remoteUser, publishedPackage);
        })
      ).catch((error) => {
        logger.error({ error }, 'notify request has failed: @error');
      });

      // @ts-ignore
      return Object.keys(results).map((promiseValue) => results[promiseValue].value);
    }
  } else {
    debug('no notifications configuration detected');
    return [false];
  }
}
