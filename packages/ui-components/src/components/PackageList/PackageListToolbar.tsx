import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { NO_SCOPE, PackageSort } from './filterPackages';

type Props = {
  query: string;
  scope: string;
  sort: PackageSort;
  scopes: string[];
  shown: number;
  total: number;
  onQueryChange: (query: string) => void;
  onScopeChange: (scope: string) => void;
  onSortChange: (sort: PackageSort) => void;
};

// side by side on phones, natural width from sm up
const selectSx = (minWidth: number) => ({
  flex: { xs: '1 1 0', sm: '0 0 auto' },
  minWidth: { xs: 0, sm: minWidth },
});

const PackageListToolbar: React.FC<Props> = ({
  query,
  scope,
  sort,
  scopes,
  shown,
  total,
  onQueryChange,
  onScopeChange,
  onSortChange,
}) => {
  const { t } = useTranslation();
  return (
    <Box
      data-testid="package-list-toolbar"
      sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, px: 2, pb: 2 }}
    >
      <TextField
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={t('packageList.filter')}
        size="small"
        slotProps={{
          htmlInput: {
            'aria-label': t('packageList.filter'),
            'data-testid': 'package-list-filter',
          },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ flex: { xs: '1 1 100%', sm: '1 1 240px' } }}
        type="search"
        value={query}
      />
      {scopes.length > 1 && (
        <TextField
          label={t('packageList.scope')}
          onChange={(event) => onScopeChange(event.target.value)}
          select={true}
          size="small"
          slotProps={{
            htmlInput: { 'data-testid': 'package-list-scope' },
            inputLabel: { shrink: true },
            select: { displayEmpty: true },
          }}
          sx={selectSx(160)}
          value={scope}
        >
          <MenuItem value="">{t('packageList.all-scopes')}</MenuItem>
          {scopes.map((item) => (
            <MenuItem key={item} value={item}>
              {item === NO_SCOPE ? t('packageList.no-scope') : item}
            </MenuItem>
          ))}
        </TextField>
      )}
      <TextField
        label={t('packageList.sort')}
        onChange={(event) => onSortChange(event.target.value as PackageSort)}
        select={true}
        size="small"
        slotProps={{ htmlInput: { 'data-testid': 'package-list-sort' } }}
        sx={selectSx(180)}
        value={sort}
      >
        <MenuItem value={PackageSort.DEFAULT}>{t('packageList.sort-default')}</MenuItem>
        <MenuItem value={PackageSort.NAME}>{t('packageList.sort-name')}</MenuItem>
        <MenuItem value={PackageSort.RECENT}>{t('packageList.sort-recent')}</MenuItem>
      </TextField>
      <Typography
        aria-live="polite"
        color="text.secondary"
        data-testid="package-list-count"
        sx={{ width: { xs: '100%', sm: 'auto' } }}
        variant="body2"
      >
        {t('packageList.count', { shown, total })}
      </Typography>
    </Box>
  );
};

export default PackageListToolbar;
