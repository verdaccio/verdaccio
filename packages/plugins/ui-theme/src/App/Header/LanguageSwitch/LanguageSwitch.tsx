import styled from '@emotion/styled';
import { withStyles } from '@material-ui/core/styles';
import LanguageIcon from '@material-ui/icons/Language';
import i18next, { TFunctionKeys } from 'i18next';
import React, { useCallback, useContext, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AutoComplete } from 'verdaccio-ui/components/AutoComplete/AutoCompleteV2';
import {
  France,
  Brazil,
  Germany,
  Spain,
  China,
  Russia,
  Turkey,
  Ukraine,
  Khmer,
  Japan,
  Usa,
  Czech,
  Taiwan,
} from 'verdaccio-ui/components/Icons';
import MenuItem from 'verdaccio-ui/components/MenuItem';
import { Theme } from 'verdaccio-ui/design-tokens/theme';
import ThemeContext from 'verdaccio-ui/design-tokens/ThemeContext';

import { Language } from '../../../../i18n/config';

const lngDetails: Record<Language, { translation: TFunctionKeys; icon: React.ReactElement }> = {
  'fr-FR': {
    translation: 'lng.french',
    icon: <France size="md" />,
  },
  'pt-BR': {
    translation: 'lng.portuguese',
    icon: <Brazil size="md" />,
  },
  'de-DE': {
    translation: 'lng.german',
    icon: <Germany size="md" />,
  },
  'es-ES': {
    translation: 'lng.spanish',
    icon: <Spain size="md" />,
  },
  'zh-CN': {
    translation: 'lng.chinese',
    icon: <China size="md" />,
  },
  'ru-RU': {
    translation: 'lng.russian',
    icon: <Russia size="md" />,
  },
  'tr-TR': {
    translation: 'lng.turkish',
    icon: <Turkey size="md" />,
  },
  'uk-UA': {
    translation: 'lng.ukraine',
    icon: <Ukraine size="md" />,
  },
  'km-KH': {
    translation: 'lng.khmer',
    icon: <Khmer size="md" />,
  },
  'ja-JP': {
    translation: 'lng.japanese',
    icon: <Japan size="md" />,
  },
  'en-US': {
    translation: 'lng.english',
    icon: <Usa size="md" />,
  },
  'cs-CZ': {
    translation: 'lng.czech',
    icon: <Czech size="md" />,
  },
  'zh-TW': {
    translation: 'lng.chineseTraditional',
    icon: <Taiwan size="md" />,
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
  [`@media screen and (min-width: ${theme && theme.breakPoints.medium}px)`]: {
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
