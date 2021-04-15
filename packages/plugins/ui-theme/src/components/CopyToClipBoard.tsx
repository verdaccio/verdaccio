import styled from '@emotion/styled';
import FileCopy from '@material-ui/icons/FileCopy';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { copyToClipBoardUtility } from 'verdaccio-ui/utils/cli-utils';

import IconButton from './IconButton';
import Tooltip from './Tooltip';

interface Props {
  text: string;
  children?: React.ReactNode;
}

function CopyToClipBoard({ text, children, ...props }: Props) {
  const { t } = useTranslation();
  return (
    <Wrapper {...props}>
      <Content>{children ?? text}</Content>
      <Tooltip disableFocusListener={true} title={t('copy-to-clipboard')}>
        <IconButton onClick={copyToClipBoardUtility(text)} data-testid="copy-icon">
          <FileCopy />
        </IconButton>
      </Tooltip>
    </Wrapper>
  );
}

export default CopyToClipBoard;

const Wrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const Content = styled('span')({
  display: 'inline-block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  height: '21px',
  fontSize: '1rem',
});
