import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import i18next from 'i18next';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { Theme } from '../../';
import { useLanguage } from '../../';
import { DEFAULT_TRANSLATION_LANGUAGE } from '../../i18n/loadTranslationFile';
import { getTranslationProgress } from '../../i18n/translationProgress';

export const CardSelected = styled(Card)<{ theme?: Theme }>(({ theme }) => ({
  backgroundColor: theme.palette.grey['600'],
  color: theme.palette.error.contrastText,
  fontWeight: 'bold',
}));

export const CardUnSelected = styled(Card)<{ theme?: Theme }>(({ theme }) => ({
  ':hover': {
    backgroundColor: theme.palette.greyGainsboro,
  },
}));

const FlagIcon = styled('span')({
  display: 'inline-flex',
  flexShrink: 0,
  width: 24,
  '& svg': { width: '100%', height: 'auto' },
});

type TranslationResources = Record<string, { translation?: Record<string, unknown> }>;

const LanguageContent = ({ name, icon: Icon, progress }) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
        <FlagIcon>
          <Icon />
        </FlagIcon>
        <Typography noWrap={true} title={name} variant="body2">
          {name}
        </Typography>
      </Box>
      <Typography component="div" sx={{ mt: 0.5 }} variant="caption">
        {t('language.progress', { progress })}
      </Typography>
      <LinearProgress
        aria-label={t('language.progress', { progress })}
        color="inherit"
        sx={{ borderRadius: 1, height: 3, opacity: 0.7 }}
        value={progress}
        variant="determinate"
      />
    </Box>
  );
};

const LanguageSwitch = () => {
  const { language: currentLanguage, setLanguage, listLanguages } = useLanguage();
  const { t } = useTranslation();

  const languages = useMemo(() => {
    const resources = (i18next.options?.resources || {}) as TranslationResources;
    const source = resources[DEFAULT_TRANSLATION_LANGUAGE]?.translation ?? {};
    return Object.keys(resources).map((lng) => {
      const item =
        listLanguages.find((language) => language.lng === lng) ??
        listLanguages.find((language) => language.lng === DEFAULT_TRANSLATION_LANGUAGE);
      return {
        lng,
        icon: item?.icon ?? (() => null),
        menuKey: item?.menuKey ?? lng,
        progress: getTranslationProgress(source, resources[lng]?.translation),
      };
    });
  }, [listLanguages]);

  return (
    <Grid container={true} spacing={1} sx={{ mb: 2 }}>
      {languages.map(({ lng, icon, menuKey, progress }) => {
        const content = <LanguageContent icon={icon} name={t(menuKey)} progress={progress} />;
        return (
          <Grid key={lng} size={{ xs: 6, sm: 4, md: 3 }}>
            {lng === currentLanguage ? (
              <CardSelected aria-current="true">{content}</CardSelected>
            ) : (
              <CardUnSelected>
                <CardActionArea onClick={() => setLanguage(lng)}>{content}</CardActionArea>
              </CardUnSelected>
            )}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default LanguageSwitch;
