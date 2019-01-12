/**
 * @prettier
 * @flow
 */

import React from 'react';
import FileCopy from '@material-ui/icons/FileCopy';
import Tooltip from '@material-ui/core/Tooltip/index';

import type { Node } from 'react';
import { IProps } from './types';

import { ClipBoardCopy, ClipBoardCopyText, CopyIcon } from './styles';
import { copyToClipBoardUtility } from '../../utils/cli-utils';
import { TEXT } from '../../utils/constants';

const CopyToClipBoard = ({ text }: IProps): Node => {
  const renderToolTipFileCopy = () => (
    <Tooltip disableFocusListener={true} title={TEXT.CLIPBOARD_COPY}>
      <CopyIcon onClick={copyToClipBoardUtility(text)}>
        <FileCopy />
      </CopyIcon>
    </Tooltip>
  );
  return (
    <ClipBoardCopy>
      <ClipBoardCopyText>{text}</ClipBoardCopyText>
      {renderToolTipFileCopy()}
    </ClipBoardCopy>
  );
};

export default CopyToClipBoard;
