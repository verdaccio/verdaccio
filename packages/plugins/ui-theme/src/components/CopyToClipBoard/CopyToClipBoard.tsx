import FileCopy from '@material-ui/icons/FileCopy';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { copyToClipBoardUtility } from 'verdaccio-ui/utils/cli-utils';

import Tooltip from '../Tooltip';

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
  const { t } = useTranslation();
  return (
    <ClipBoardCopy>
      {renderText(text, children)}
      <Tooltip disableFocusListener={true} title={t('copy-to-clipboard')}>
        <CopyIcon onClick={copyToClipBoardUtility(text)} data-testid="copy-icon">
          <FileCopy />
        </CopyIcon>
      </Tooltip>
    </ClipBoardCopy>
  );
};

export default CopyToClipBoard;
