/**
 * @prettier
 */

import fs from 'fs';
import { sync as globSync } from 'glob';
import last from 'lodash/last';

const MESSAGES_PATTERN = './static/messages/**/*.json';
const LANG_PATTERN = './src/webui/i18n/*.json';
const LANG_DIR = './src/webui/i18n/';

// Try to delete current json file: all.json
try {
  fs.unlinkSync('./src/webui/i18n/all.json');
} catch (error) {
  console.log(error);
}

// Merge translated json files (es.json, fr.json, etc) into one object
// so that they can be merged with the eggregated "en" object below

const mergedTranslations = globSync(LANG_PATTERN)
  .map(filename => {
    const locale = last(filename.split('/')).split('.json')[0];
    return { [locale]: JSON.parse(fs.readFileSync(filename, 'utf8')) };
  })
  .reduce((acc, localeObj) => {
    return { ...acc, ...localeObj };
  }, {});

// Aggregates the default messages that were extracted from the example app's
// React components via the React Intl Babel plugin. An error will be thrown if
// there are messages in different components that use the same `id`. The result
// is a flat collection of `id: message` pairs for the app's default locale.

const defaultMessages = globSync(MESSAGES_PATTERN)
  .map(filename => fs.readFileSync(filename, 'utf8'))
  .map(file => JSON.parse(file))
  .reduce((collection, descriptors) => {
    descriptors.forEach(({ id, defaultMessage }) => {
      if (collection.hasOwnProperty(id)) {
        throw new Error(`Duplicate message id: ${id}`);
      }
      collection[id] = defaultMessage;
    });

    return collection;
  }, {});

// write the default messages file and write the messages to this directory
fs.writeFileSync(`${LANG_DIR}en.json`, JSON.stringify(defaultMessages, null, 2));

// Merge aggregated default messages with the translated json files and
// write the messages to this directory
fs.writeFileSync(`${LANG_DIR}all.json`, JSON.stringify({ en: defaultMessages, ...mergedTranslations }, null, 2));
