/* eslint-disable react/jsx-pascal-case */
import styled from '@emotion/styled';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import i18next from 'i18next';
import React, { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ThemeContext from 'verdaccio-ui/design-tokens/ThemeContext';
import { Theme } from 'verdaccio-ui/design-tokens/theme';

import { Language, listLanguages } from '../../i18n/enabledLanguages';

const listConverted = listLanguages.reduce((prev, item) => {
  prev[item.lng] = {
    translation: item.menuKey,
    icon: item.icon,
  };
  return prev;
}, {});

export const CardSelected = styled(Card)<{ theme?: Theme }>(({ theme }) => {
  return {
    backgroundColor: theme?.palette?.grey['600'],
    opacity: '0.9',
    color: theme?.palette?.error.contrastText,
    fontWeight: 'bold',
  };
});

export const CardUnSelected = styled(Card)<{ theme?: Theme }>(({ theme }) => {
  return {
    cursor: 'pointer',
    ':hover': {
      backgroundColor: theme?.palette.greyGainsboro,
    },
  };
});

const LanguageContent = ({ translation, icon }) => (
  <>
    <CardContent>
      <Typography display="block" gutterBottom={true} variant="caption">
        {translation}
      </Typography>
    </CardContent>
    <CardContent>{icon}</CardContent>
  </>
);

const LanguageSwitch = () => {
  const themeContext = useContext(ThemeContext) as any;
  const [languages] = useState<Language[]>(
    Object.keys(i18next.options?.resources || {}) as Language[]
  );
  const { t } = useTranslation();
  const currentLanguage = themeContext.language;
  const getCurrentLngDetails = useCallback(
    (language: Language) => {
      const lng = listConverted[language] || listConverted['en-US'];
      return {
        icon: <lng.icon />,
        translation: t(lng.translation),
      };
    },
    [t]
  );
  const handleChangeLanguage = useCallback(
    (language: Language) => {
      themeContext.setLanguage(language);
    },
    [themeContext]
  );

  return (
    <div>
      <Grid columns={{ xs: 12, sm: 12, md: 12 }} container={true} spacing={{ xs: 1, md: 1 }}>
        {languages.map((language, index) => {
          const { icon, translation } = getCurrentLngDetails(language);
          return (
            <Grid item={true} key={index} sm={2} xs={6}>
              {language === currentLanguage ? (
                <CardSelected sx={{ maxWidth: 80 }}>
                  <LanguageContent icon={icon} translation={translation} />
                </CardSelected>
              ) : (
                <CardUnSelected
                  onClick={() => handleChangeLanguage(language)}
                  sx={{ maxWidth: 80 }}
                >
                  <LanguageContent icon={icon} translation={translation} />
                </CardUnSelected>
              )}
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default LanguageSwitch;
