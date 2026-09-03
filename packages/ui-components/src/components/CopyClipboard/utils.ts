import type { SyntheticEvent } from 'react';

// clipboard-api-free fallback: outside a secure context (plain-http deployments,
// very common for LAN registries) `navigator.clipboard` is undefined
function execCommandCopy(str: string): void {
  const node = document.createElement('div');
  node.innerText = str;
  if (document.body) {
    document.body.appendChild(node);

    const range = document.createRange();
    const selection = window.getSelection() as Selection;
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges();
    document.body.removeChild(node);
  }
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
