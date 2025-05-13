import { DEFAULT_USER, cryptoUtils } from '@verdaccio/core';
import { Author, Person, WebManifest } from '@verdaccio/types';

const AVATAR_PROVIDER = 'https://www.gravatar.com/avatar/';

export const GENERIC_AVATAR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg height="100" viewBox="-27 24 100 100" width="100" xmlns="http://www.w3.org/' +
      '2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><circle cx="23" cy="7' +
      '4" id="a" r="50"/></defs><use fill="#F5EEE5" overflow="visible" xlink:href="#a"/' +
      '><clipPath id="b"><use overflow="visible" xlink:href="#a"/></clipPath><g clip-pa' +
      'th="url(#b)"><defs><path d="M36 95.9c0 4 4.7 5.2 7.1 5.8 7.6 2 22.8 5.9 22.8 5.9' +
      ' 3.2 1.1 5.7 3.5 7.1 6.6v9.8H-27v-9.8c1.3-3.1 3.9-5.5 7.1-6.6 0 0 15.2-3.9 22.8-' +
      '5.9 2.4-.6 7.1-1.8 7.1-5.8V85h26v10.9z" id="c"/></defs><use fill="#E6C19C" overf' +
      'low="visible" xlink:href="#c"/><clipPath id="d"><use overflow="visible" xlink:hr' +
      'ef="#c"/></clipPath><path clip-path="url(#d)" d="M23.2 35h.2c3.3 0 8.2.2 11.4 2 ' +
      '3.3 1.9 7.3 5.6 8.5 12.1 2.4 13.7-2.1 35.4-6.3 42.4-4 6.7-9.8 9.2-13.5 9.4H23h-.' +
      '1c-3.7-.2-9.5-2.7-13.5-9.4-4.2-7-8.7-28.7-6.3-42.4 1.2-6.5 5.2-10.2 8.5-12.1 3.2' +
      '-1.8 8.1-2 11.4-2h.2z" fill="#D4B08C"/></g><path d="M22.6 40c19.1 0 20.7 13.8 20' +
      '.8 15.1 1.1 11.9-3 28.1-6.8 33.7-4 5.9-9.8 8.1-13.5 8.3h-.5c-3.8-.3-9.6-2.5-13.6' +
      '-8.4-3.8-5.6-7.9-21.8-6.8-33.8C2.3 53.7 3.5 40 22.6 40z" fill="#F2CEA5"/></svg>'
  );

/**
 * Formats author field for webui.
 * @see https://docs.npmjs.com/files/package.json#author
 * @param {string|object|undefined} author
 */
export function formatAuthor(author?: Person): any {
  let authorDetails = {
    name: DEFAULT_USER,
    email: '',
    url: '',
  };

  if (author === null || author === undefined) {
    return authorDetails;
  }

  if (typeof author === 'string') {
    authorDetails = {
      ...authorDetails,
      name: author as string,
    };
  }

  if (typeof author === 'object') {
    authorDetails = {
      ...authorDetails,
      ...(author as Author),
    };
  }

  return authorDetails;
}

export function addGravatarSupport(pkgInfo: WebManifest, online: boolean = true): Author {
  const pkgInfoCopy = { ...pkgInfo } as any;
  const author: any = pkgInfo?.latest?.author ?? null;
  const contributors: Person[] = normalizeAuthors(pkgInfo?.latest?.contributors ?? []);
  const maintainers: Person[] = normalizeAuthors(pkgInfo?.latest?.maintainers ?? []);

  // for author
  if (author && typeof author === 'object') {
    const { email } = author as Author;
    pkgInfoCopy.latest.author._avatar = generateGravatarUrl(email, online);
  } else if (author && typeof author === 'string') {
    const { email, name, url } = splitAuthorString(author);
    pkgInfoCopy.latest.author = {
      _avatar: generateGravatarUrl(email, online),
      email,
      name,
      url,
    };
  }

  // for contributors
  if (contributors && contributors.length > 0) {
    pkgInfoCopy.latest.contributors = contributors.map((contributor): Person => {
      if (typeof contributor === 'object') {
        contributor._avatar = generateGravatarUrl(contributor.email, online);
      } else if (typeof contributor === 'string') {
        const { email, name, url } = splitAuthorString(contributor);
        contributor = {
          _avatar: generateGravatarUrl(email, online),
          email,
          name,
          url,
        };
      }

      return contributor;
    });
  }

  // for maintainers
  if (maintainers && maintainers.length > 0) {
    pkgInfoCopy.latest.maintainers = maintainers.map((maintainer): Person => {
      if (typeof maintainer === 'object') {
        maintainer._avatar = generateGravatarUrl(maintainer.email, online);
      } else if (typeof maintainer === 'string') {
        const { email, name, url } = splitAuthorString(maintainer);
        maintainer = {
          _avatar: generateGravatarUrl(email, online),
          email,
          name,
          url,
        };
      }

      return maintainer;
    });
  }

  return pkgInfoCopy;
}

/**
 * Generate gravatar url from email address
 */
export function generateGravatarUrl(email: string | void = '', online: boolean = true): string {
  if (online && typeof email === 'string' && email.length > 0) {
    email = email.trim().toLocaleLowerCase();
    const emailMD5 = cryptoUtils.stringToMD5(email);
    return `${AVATAR_PROVIDER}${emailMD5}`;
  }
  return GENERIC_AVATAR;
}

function normalizeAuthors(authors: Person[]): Person[] {
  if (authors === null || authors === undefined) {
    return [];
  } else if (authors && !Array.isArray(authors)) {
    return [authors];
  } else if (typeof authors === 'string') {
    return [
      {
        name: authors,
      },
    ];
  }

  return authors;
}

/**
 * Split author string into name, email and url
 * Example: "Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)"
 * @param {string} author
 * @returns {Object} { name: string, email: string, url: string }
 */
function splitAuthorString(author: string): { name: string; email?: string; url: string } {
  const regex = /^([^<]+)?(?:<([^>]+)>)?(?:\s*\((.*?)\))?$/;
  const match = author.match(regex);
  return {
    name: match?.[1]?.trim() || author,
    email: match?.[2]?.trim() || '',
    url: match?.[3]?.trim() || '',
  };
}
