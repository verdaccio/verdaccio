import { SyntheticEvent } from 'react';

export const copyToClipBoardUtility =
  (str: string): ((e: SyntheticEvent<HTMLElement>) => void) =>
  (event: SyntheticEvent<HTMLElement>): void => {
    event.preventDefault();

    // document.execCommand is deprecated
    navigator.clipboard.writeText(str);
  };
