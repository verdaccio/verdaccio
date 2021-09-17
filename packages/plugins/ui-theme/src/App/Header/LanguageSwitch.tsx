/* eslint-disable react/jsx-pascal-case */
import styled from '@emotion/styled';
import { withStyles } from '@material-ui/core/styles';
import LanguageIcon from '@material-ui/icons/Language';
import i18next from 'i18next';
import React, { useCallback, useContext, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AutoComplete } from 'verdaccio-ui/components/AutoComplete/AutoCompleteV2';
import MenuItem from 'verdaccio-ui/components/MenuItem';
import { Theme } from 'verdaccio-ui/design-tokens/theme';
import ThemeContext from 'verdaccio-ui/design-tokens/ThemeContext';

import { Language, listLanguages } from '../../i18n/enabledLanguages';

const listConverted = listLanguages.reduce((prev, item) => {
  prev[item.lng] = {
    translation: item.menuKey,
    icon: item.icon,
  };
  return prev;
}, {});

const LanguageSwitch = () => {
  const themeContext = useContext(ThemeContext);
  const [languages] = useState<Language[]>(
    Object.keys(i18next.options?.resources || {}) as Language[]
  );
  const { t } = useTranslation();

  if (!themeContext) {
    throw Error(t('theme-context-not-correct-used'));
  }

  const currentLanguage = themeContext.language;

  const switchLanguage = useCallback(
    ({ language }: { language: Language }) => {
      themeContext.setLanguage(language);
    },
    [themeContext]
  );

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

  const options = useMemo(
    () =>
      languages.map((language) => {
        const { icon, translation } = getCurrentLngDetails(language);
        return {
          language,
          icon,
          translation,
        };
      }),
    [languages, getCurrentLngDetails]
  );

  const option = useCallback(
    ({ icon, translation }: ReturnType<typeof getCurrentLngDetails>) => (
      <StyledMenuItem component="div">
        {icon}
        {translation}
      </StyledMenuItem>
    ),
    []
  );

  const optionLabel = useCallback(
    ({ translation }: ReturnType<typeof getCurrentLngDetails>) => translation,
    []
  );

  return (
    <Wrapper>
      <AutoComplete
        defaultValue={getCurrentLngDetails(currentLanguage).translation}
        getOptionLabel={optionLabel}
        hasClearIcon={true}
        inputStartAdornment={<StyledLanguageIcon />}
        onClick={switchLanguage}
        options={options}
        renderOption={option}
        variant="outlined"
      />
    </Wrapper>
  );
};

export default LanguageSwitch;

const StyledLanguageIcon = styled(LanguageIcon)<{ theme?: Theme }>(({ theme }) => ({
  color: theme?.palette.white,
}));

const Wrapper = styled('div')<{ theme?: Theme }>(({ theme }) => ({
  width: 220,
  display: 'none',
  [`@media screen and (min-width: ${theme?.breakPoints.medium}px)`]: {
    display: 'inline-block',
  },
}));

const StyledMenuItem = withStyles((theme: Theme) => ({
  root: {
    display: 'grid',
    cursor: 'pointer',
    gridGap: theme?.spacing(0.5),
    gridTemplateColumns: '20px 1fr',
    alignItems: 'center',
    '&:first-child': {
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
    },
  },
}))(MenuItem);
