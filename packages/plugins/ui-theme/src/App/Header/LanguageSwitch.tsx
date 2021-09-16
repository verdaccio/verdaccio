/* eslint-disable react/jsx-pascal-case */
import styled from '@emotion/styled';
import { withStyles } from '@material-ui/core/styles';
import LanguageIcon from '@material-ui/icons/Language';
import Flags from 'country-flag-icons/react/3x2';
import i18next, { TFunctionKeys } from 'i18next';
import React, { useCallback, useContext, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Language } from 'src/i18n/enabledLanguages';

import { AutoComplete } from 'verdaccio-ui/components/AutoComplete/AutoCompleteV2';
import MenuItem from 'verdaccio-ui/components/MenuItem';
import { Theme } from 'verdaccio-ui/design-tokens/theme';
import ThemeContext from 'verdaccio-ui/design-tokens/ThemeContext';

const lngDetails: Record<Language, { translation: TFunctionKeys; icon: React.ReactElement }> = {
  'fr-FR': {
    translation: 'lng.french',
    icon: <Flags.FR />,
  },
  'pt-BR': {
    translation: 'lng.portuguese',
    icon: <Flags.BR />,
  },
  'de-DE': {
    translation: 'lng.german',
    icon: <Flags.DE />,
  },
  'es-ES': {
    translation: 'lng.spanish',
    icon: <Flags.ES />,
  },
  'zh-CN': {
    translation: 'lng.chinese',
    icon: <Flags.CN />,
  },
  'ru-RU': {
    translation: 'lng.russian',
    icon: <Flags.RU />,
  },
  'tr-TR': {
    translation: 'lng.turkish',
    icon: <Flags.TR />,
  },
  'uk-UA': {
    translation: 'lng.ukraine',
    icon: <Flags.UA />,
  },
  'km-KH': {
    translation: 'lng.khmer',
    icon: <Flags.KH />,
  },
  'ja-JP': {
    translation: 'lng.japanese',
    icon: <Flags.JP />,
  },
  'en-US': {
    translation: 'lng.english',
    icon: <Flags.US />,
  },
  'cs-CZ': {
    translation: 'lng.czech',
    icon: <Flags.CZ />,
  },
  'zh-TW': {
    translation: 'lng.chineseTraditional',
    icon: <Flags.TW />,
  },
};

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
      const { icon, translation } = lngDetails[language] || lngDetails['en-US'];
      return {
        icon,
        translation: t(translation),
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
