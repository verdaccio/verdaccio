/**
 * @prettier
 * @flow
 */

export const copyToClipBoardUtility = (str: string) => (event: SyntheticEvent<HTMLElement>) => {
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

export function getCLISetConfigRegistry(command: string, scope: string, registryUrl: string): string {
  return `${command} ${scope} registry ${registryUrl}`;
}

export function getCLISetRegistry(command: string, registryUrl: string): string {
  return `${command} --registry ${registryUrl}`;
}

export function getCLIChangePassword(command: string, registryUrl: string): string {
  return `${command} profile set password --registry ${registryUrl}`;
}
