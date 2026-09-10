import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Theme } from '../../Theme';
import type { PackageMetaInterface } from '../../types/packageMeta';
import KeywordListItems from './KeywordListItems';

const Keywords: React.FC<{ packageMeta: PackageMetaInterface }> = ({ packageMeta }) => {
  const { t } = useTranslation();
  const theme: Theme = useTheme();

  // `keywords: []` is very common in real manifests and must not paint an
  // empty "Keywords" section
  if (!packageMeta?.latest?.keywords || packageMeta.latest.keywords.length === 0) {
    return null;
  }

  return (
    <List
      data-testid="keyword-list"
      subheader={
        <Typography
          sx={{ fontWeight: theme.fontWeight.bold, textTransform: 'capitalize' }}
          variant="subtitle1"
        >
          {t('sidebar.keywords.title')}
        </Typography>
      }
    >
      <KeywordListItems keywords={packageMeta?.latest?.keywords} />
    </List>
  );
};

export default Keywords;
