import styled from '@emotion/styled';
import Check from '@mui/icons-material/Check';
import FileCopy from '@mui/icons-material/FileCopy';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { Theme } from '../../Theme';
import { copyToClipBoardUtility } from './utils';
import { VisuallyHidden } from '../VisuallyHidden';

interface Props {
  text: string;
  title?: string;
  dataTestId: string;
  children?: React.ReactNode;
}

export const COPIED_FEEDBACK_MS = 2000;

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
  const [copied, setCopied] = useState(false);
  // without a title the icon button had no accessible name at all
  const accessibleName = copied ? t('copy-to-clipboard-done') : (title ?? t('copy-to-clipboard'));

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = (event: React.SyntheticEvent<HTMLElement>) => {
    // announce the copy only when the clipboard really changed
    copyToClipBoardUtility(text)(event).then((ok) => setCopied(ok));
  };

  const button = (
    <IconButton
      aria-label={accessibleName}
      data-testid={dataTestId}
      onClick={handleCopy}
      size="small"
    >
      {copied ? <Check color="success" fontSize="small" /> : <FileCopy fontSize="small" />}
    </IconButton>
  );

  return (
    <Wrapper {...props}>
      <Content>{children ?? text}</Content>
      {title ? (
        <Tooltip disableFocusListener={true} title={copied ? t('copy-to-clipboard-done') : title}>
          {button}
        </Tooltip>
      ) : (
        button
      )}
      <VisuallyHidden aria-live="polite">
        {copied ? t('copy-to-clipboard-done') : ''}
      </VisuallyHidden>
    </Wrapper>
  );
}

export default CopyToClipBoard;
