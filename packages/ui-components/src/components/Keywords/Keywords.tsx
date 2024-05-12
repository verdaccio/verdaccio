import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/styles';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { PackageMetaInterface } from '../../types/packageMeta';

const Keywords: FC<{ packageMeta: PackageMetaInterface }> = ({ packageMeta }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  if (!packageMeta?.latest?.keywords) {
    return null;
  }

  const { keywords } = packageMeta.latest;
  const keywordList = typeof keywords === 'string' ? [keywords] : keywords;

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
      <ListItem sx={{ px: 0, flexWrap: 'wrap' }}>
        {keywordList.sort().map((keyword, index) => (
          <Chip key={index} label={keyword} sx={{ mt: 1, mr: 1 }} />
        ))}
      </ListItem>
    </List>
  );
};

export default Keywords;
