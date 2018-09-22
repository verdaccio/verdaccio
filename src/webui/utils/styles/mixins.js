/**
 * @prettier
 */

// @flow

export const copyToClipBoard = (str: string) => (event: SyntheticEvent<HTMLElement>) => {
  event.preventDefault();
  const node = document.createElement('div');
  node.innerText = str;
  if (document.body) {
    document.body.appendChild(node);
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    // $FlowFixMe
    document.body.removeChild(node);
  }
};
