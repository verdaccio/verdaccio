import { SyntheticEvent } from 'react';

export const copyToClipBoardUtility = (str: string): ((e: SyntheticEvent<HTMLElement>) => void) => (
  event: SyntheticEvent<HTMLElement>
): void => {
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

export function getCLISetConfigRegistry(command: string, scope: string, registryUrl: string): string {
  // if there is a scope defined there needs to be a ":" separator between the scope and the registry
  return `${command} ${scope}${scope !== '' ? ':' : ''}registry ${registryUrl}`;
}

export function getCLISetRegistry(command: string, registryUrl: string): string {
  return `${command} --registry ${registryUrl}`;
}

export function getCLIChangePassword(command: string, registryUrl: string): string {
  return `${command} profile set password --registry ${registryUrl}`;
}
