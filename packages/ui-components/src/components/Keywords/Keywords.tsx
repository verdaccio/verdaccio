import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { PackageMetaInterface } from '../../types/packageMeta';
import KeywordList from './KeywordList';

const Keywords: React.FC<{ packageMeta: PackageMetaInterface }> = ({ packageMeta }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  if (!packageMeta?.latest?.keywords) {
    return null;
  }

  return (
    <List
      subheader={
        <Typography
          sx={{ fontWeight: theme.fontWeight.bold, textTransform: 'capitalize' }}
          variant="subtitle1"
        >
          {t('sidebar.keywords.title')}
        </Typography>
      }
    >
      <KeywordList keywords={packageMeta?.latest?.keywords} />
    </List>
  );
};

export default Keywords;
