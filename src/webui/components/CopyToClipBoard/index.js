/**
 * @prettier
 * @flow
 */
import React from 'react';
import FileCopy from '@material-ui/icons/FileCopy';
import Tooltip from '@material-ui/core/Tooltip/index';

import type {Node} from 'react';
import {IProps} from './interfaces';

import {ClipBoardCopy, ClipBoardCopyText, CopyIcon} from './styles';

const copyToClipBoardUtility = (str: string) => (event: SyntheticEvent<HTMLElement>) => {
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

const CopyToClipBoard = ({text}: IProps): Node => (
  <ClipBoardCopy>
    <ClipBoardCopyText>{text}</ClipBoardCopyText>
    <Tooltip title="Copy to Clipboard">
      <CopyIcon aria-label="Copy to Clipboard" onClick={copyToClipBoardUtility(text)}>
        <FileCopy />
      </CopyIcon>
    </Tooltip>
  </ClipBoardCopy>
);

export default CopyToClipBoard;
