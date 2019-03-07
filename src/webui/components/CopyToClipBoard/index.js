/**
 * @prettier
 * @flow
 */

import React from 'react';
import type { Node } from 'react';

import FileCopy from '@material-ui/icons/FileCopy';
import Tooltip from '@material-ui/core/Tooltip/index';

import { ClipBoardCopy, ClipBoardCopyText, CopyIcon } from './styles';
import { copyToClipBoardUtility } from '../../utils/cli-utils';
import { TEXT } from '../../utils/constants';
import { IProps } from './types';

const CopyToClipBoard = ({ text, children }: IProps): Node => {
  const renderToolTipFileCopy = () => (
    <Tooltip disableFocusListener={true} title={TEXT.CLIPBOARD_COPY}>
      <CopyIcon onClick={copyToClipBoardUtility(text)}>
        <FileCopy />
      </CopyIcon>
    </Tooltip>
  );

  const renderText = children => {
    if (children) {
      return <ClipBoardCopyText>{children}</ClipBoardCopyText>;
    }

    return <ClipBoardCopyText>{text}</ClipBoardCopyText>;
  };
  return (
    <ClipBoardCopy>
      {renderText(children)}
      {renderToolTipFileCopy()}
    </ClipBoardCopy>
  );
};

export default CopyToClipBoard;
