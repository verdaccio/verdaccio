import { SyntheticEvent } from 'react';

export const copyToClipBoardUtility =
  (str: string): ((e: SyntheticEvent<HTMLElement>) => void) =>
  (event: SyntheticEvent<HTMLElement>): void => {
    event.preventDefault();

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
      document.body.removeChild(node);
    }
  };
