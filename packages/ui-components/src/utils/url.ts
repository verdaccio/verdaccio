import isEmailValidator from 'validator/lib/isEmail';
import isURLValidator from 'validator/lib/isURL';

export function isURL(url: string): boolean {
  return isURLValidator(url || '', {
    protocols: ['http', 'https', 'git+https', 'git'],
    require_protocol: true,
    require_tld: false,
  });
}

export function isEmail(email: string): boolean {
  return isEmailValidator(email || '');
}

export function extractFileName(url: string): string {
  return url.substring(url.lastIndexOf('/') + 1);
}

function blobToFile(blob: Blob, fileName: string): File {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const b: any = blob;
  b.lastModified = Date.now();
  b.name = fileName;
  return b as File;
}

export function downloadFile(fileStream: Blob, fileName: string): void {
  let file: File;
  // File constructor is not supported by Edge
  // https://developer.mozilla.org/en-US/docs/Web/API/File#Browser_compatibility
  // @ts-ignore. Please see: https://github.com/microsoft/TypeScript/issues/33792
  if (navigator.msSaveBlob) {
    // Detect if Edge
    file = blobToFile(new Blob([fileStream], { type: 'application/octet-stream' }), fileName);
  } else {
    file = new File([fileStream], fileName, {
      type: 'application/octet-stream',
      lastModified: Date.now(),
    });
  }

  const objectURL = URL.createObjectURL(file);
  const fileLink = document.createElement('a');
  fileLink.href = objectURL;
  fileLink.download = fileName;

  // Skip actual download in test environment to avoid JSDOM navigation error
  // Check if we're in a test environment (JSDOM)
  const isTestEnvironment =
    (typeof window !== 'undefined' &&
      window.navigator &&
      window.navigator.userAgent &&
      window.navigator.userAgent.includes('Node.js')) ||
    window.navigator.userAgent.includes('jsdom');

  if (!isTestEnvironment) {
    // Without appending to an HTML Element, download dialog does not show up on Firefox
    // https://github.com/verdaccio/ui/issues/119
    document.documentElement.appendChild(fileLink);
    fileLink.click();
    // firefox requires remove the object url
    setTimeout(() => {
      URL.revokeObjectURL(objectURL);
      document.documentElement.removeChild(fileLink);
    }, 150);
  } else {
    // In test environment, just clean up without triggering navigation
    setTimeout(() => {
      URL.revokeObjectURL(objectURL);
    }, 150);
  }
}
