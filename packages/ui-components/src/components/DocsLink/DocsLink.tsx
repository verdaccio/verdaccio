import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Link from '@mui/material/Link';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { VisuallyHidden } from '../VisuallyHidden';

export const VERDACCIO_DOCS_URL = 'https://verdaccio.org/docs/what-is-verdaccio';

/** A link to the Verdaccio documentation, marked as opening in a new tab. */
const DocsLink: React.FC<{ href?: string; dataTestId?: string }> = ({
  href = VERDACCIO_DOCS_URL,
  dataTestId = 'docs-link',
}) => {
  const { t } = useTranslation();
  return (
    <Link
      data-testid={dataTestId}
      href={href}
      rel="noopener noreferrer"
      sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
      target="_blank"
    >
      {t('dialog.docs-link')}
      <OpenInNewIcon aria-hidden={true} fontSize="small" />
      <VisuallyHidden>{t('dialog.opens-in-new-tab')}</VisuallyHidden>
    </Link>
  );
};

export default DocsLink;
