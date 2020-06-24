/* eslint-disable react/prop-types */
import FileCopy from '@material-ui/icons/FileCopy';
import { default as MaterialUITooltip } from '@material-ui/core/Tooltip';
import React from 'react';

import { copyToClipBoardUtility } from '../../utils/cli-utils';

import { ClipBoardCopy, ClipBoardCopyText, CopyIcon } from './styles';

interface Props {
  text: string;
  children?: React.ReactNode;
}

const renderText = (text: string, children: React.ReactNode): JSX.Element => {
  if (children) {
    return <ClipBoardCopyText>{children}</ClipBoardCopyText>;
  }

  return <ClipBoardCopyText>{text}</ClipBoardCopyText>;
};

const CopyToClipBoard: React.FC<Props> = ({ text, children }) => {
  return (
    <ClipBoardCopy>
      {renderText(text, children)}
      <MaterialUITooltip disableFocusListener={true} title="Copy to ClipBoard">
        <CopyIcon onClick={copyToClipBoardUtility(text)}>
          <FileCopy />
        </CopyIcon>
      </MaterialUITooltip>
    </ClipBoardCopy>
  );
};

export default CopyToClipBoard;
