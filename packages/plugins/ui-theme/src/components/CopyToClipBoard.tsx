import React from 'react';
import { useTranslation } from 'react-i18next';

import { CopyClipboard as CopyClipboardOriginal } from '@verdaccio/ui-components';

interface Props {
  text: string;
  children?: React.ReactNode;
}

function CopyToClipBoard(props: Props) {
  const { t } = useTranslation();
  return <CopyClipboardOriginal title={t('copy-to-clipboard')} dataTestId="copy-icon" {...props} />;
}

export default CopyToClipBoard;
