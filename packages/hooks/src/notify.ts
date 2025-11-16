/* eslint-disable no-undef */
import buildDebug from 'debug';
import Handlebars from 'handlebars';

import { logger } from '@verdaccio/logger';
import { Config, Manifest, Notification, RemoteUser } from '@verdaccio/types';

import { FetchOptions, notifyRequest } from './notify-request';

const debug = buildDebug('verdaccio:hooks');

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
    } catch (error: any) {
      debug('error  template handler %o', error);
      reject(error);
    }
  });
}

export async function handleNotify(
  metadata: Partial<Manifest>,
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

  const options: FetchOptions = {
    body: content,
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
  metadata: Manifest,
  notify: Notification,
  remoteUser: Partial<RemoteUser>,
  publishedPackage: string
): Promise<boolean> {
  return handleNotify(metadata, notify, remoteUser, publishedPackage) as Promise<any>;
}

function isHasNotification(value: any): value is Notification {
  return value && typeof value === 'object' && 'endpoint' in value && 'content' in value;
}

export async function notify(
  metadata: Manifest,
  config: Config,
  remoteUser: RemoteUser,
  publishedPackage: string
): Promise<boolean[]> {
  debug('init send notification');
  const notification = config?.notify;
  if (!notification) {
    debug('no notify configuration detected');
    return [false];
  }

  const isSingle = isHasNotification(notification);
  debug('is single notify %o', isSingle);
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
    try {
      debug('send multiples notification');
      const results = await Promise.allSettled(
        Object.keys(notification).map((keyId: string) => {
          const item = notification[keyId] as Notification;
          debug('send item %o', item);
          return sendNotification(metadata, item, remoteUser, publishedPackage);
        })
      ).catch((error) => {
        logger.error({ error }, 'notify request has failed: @error');
      });
      if (!results) {
        return [];
      }

      return Object.keys(results).map((promiseValue) => results[promiseValue].value);
    } catch (error) {
      debug('error on sending multiple notification %o', error);
      return Object.keys(notification).map(() => false);
    }
  }
}
