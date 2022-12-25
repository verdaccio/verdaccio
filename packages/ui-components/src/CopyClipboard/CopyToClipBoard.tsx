import styled from '@emotion/styled';
import FileCopy from '@mui/icons-material/FileCopy';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';

import { copyToClipBoardUtility } from './utils';

interface Props {
  text: string;
  title: string;
  dataTestId: string;
  children?: React.ReactNode;
}

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

function CopyToClipBoard({ text, children, dataTestId, title, ...props }: Props) {
  return (
    <Wrapper {...props}>
      <Content>{children ?? text}</Content>
      <Tooltip disableFocusListener={true} title={title}>
        <IconButton onClick={copyToClipBoardUtility(text)} data-testid={dataTestId} size="large">
          <FileCopy />
        </IconButton>
      </Tooltip>
    </Wrapper>
  );
}

export default CopyToClipBoard;
