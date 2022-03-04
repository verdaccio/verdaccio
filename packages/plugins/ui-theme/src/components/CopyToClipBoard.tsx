import styled from '@emotion/styled';
import FileCopy from '@mui/icons-material/FileCopy';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { copyToClipBoardUtility } from 'verdaccio-ui/utils/cli-utils';

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
        <IconButton onClick={copyToClipBoardUtility(text)} data-testid="copy-icon" size="large">
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
  textOverflow: 'ellipsis',
  height: 'auto',
  whiteSpace: 'break-spaces',
  fontSize: '1rem',
});
