/**
 * @prettier
 */

// @flow

import {MouseEvent} from 'react';

export const copyToClipBoard = (str: string) => (event: MouseEvent<HTMLElement>) => {
  event.preventDefault();
  const node = document.createElement('div');
  node.innerText = str;
  document.body.appendChild(node);
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(node);
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand('copy');
  document.body.removeChild(node);
};
