import styled from '@emotion/styled';
import FileCopy from '@mui/icons-material/FileCopy';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Theme } from '../../Theme';
import { copyToClipBoardUtility } from './utils';

interface Props {
  text: string;
  title?: string;
  dataTestId: string;
  children?: React.ReactNode;
}

const Wrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const Content = styled('span')<{ theme?: Theme }>(({ theme }) => ({
  display: 'inline-block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  height: 'auto',
  whiteSpace: 'break-spaces',
  fontSize: theme.fontSize.sm,
}));

function CopyToClipBoard({ text, children, dataTestId, title, ...props }: Props) {
  const { t } = useTranslation();
  // without a title the icon button had no accessible name at all
  const accessibleName = title ?? t('copy-to-clipboard');
  return (
    <Wrapper {...props}>
      <Content>{children ?? text}</Content>
      {title ? (
        <Tooltip disableFocusListener={true} title={title}>
          <IconButton
            aria-label={accessibleName}
            data-testid={dataTestId}
            onClick={copyToClipBoardUtility(text)}
            size="small"
          >
            <FileCopy fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        <IconButton
          aria-label={accessibleName}
          data-testid={dataTestId}
          onClick={copyToClipBoardUtility(text)}
          size="small"
        >
          <FileCopy fontSize="small" />
        </IconButton>
      )}
    </Wrapper>
  );
}

export default CopyToClipBoard;
