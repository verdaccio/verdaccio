import type { SyntheticEvent } from 'react';

// clipboard-api-free fallback: outside a secure context (plain-http deployments,
// very common for LAN registries) `navigator.clipboard` is undefined. The
// hidden-textarea approach needs no Selection/Range juggling — and
// window.getSelection() can legitimately return null.
function execCommandCopy(str: string): boolean {
  if (!document.body) {
    return false;
  }
  const textarea = document.createElement('textarea');
  textarea.value = str;
  // keep it out of sight without display:none (which would prevent selection)
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.setAttribute('readonly', '');
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand?.('copy') ?? false;
  document.body.removeChild(textarea);
  return copied;
}

/** Copies `str`; resolves to whether the clipboard actually changed. */
export const copyToClipBoardUtility =
  (str: string): ((e: SyntheticEvent<HTMLElement>) => Promise<boolean>) =>
  (event: SyntheticEvent<HTMLElement>): Promise<boolean> => {
    event.preventDefault();

    if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(str).then(
        () => true,
        () => execCommandCopy(str)
      );
    }
    return Promise.resolve(execCommandCopy(str));
  };
