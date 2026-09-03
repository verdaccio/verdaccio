import type { SyntheticEvent } from 'react';

// clipboard-api-free fallback: outside a secure context (plain-http deployments,
// very common for LAN registries) `navigator.clipboard` is undefined. The
// hidden-textarea approach needs no Selection/Range juggling — and
// window.getSelection() can legitimately return null.
function execCommandCopy(str: string): void {
  if (!document.body) {
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = str;
  // keep it out of sight without display:none (which would prevent selection)
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.setAttribute('readonly', '');
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

export const copyToClipBoardUtility =
  (str: string): ((e: SyntheticEvent<HTMLElement>) => void) =>
  (event: SyntheticEvent<HTMLElement>): void => {
    event.preventDefault();

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(str).catch(() => execCommandCopy(str));
    } else {
      execCommandCopy(str);
    }
  };
