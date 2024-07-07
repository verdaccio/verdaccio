import styled from '@emotion/styled';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Theme } from '../../Theme';
import { DeveloperType } from './';

interface Props {
  type: DeveloperType;
}

const Title: React.FC<Props> = ({ type }) => {
  const { t } = useTranslation();
  switch (type) {
    case DeveloperType.CONTRIBUTORS:
      return <StyledText variant={'subtitle1'}>{t('sidebar.contributors.title')}</StyledText>;
    case DeveloperType.MAINTAINERS:
      return <StyledText variant={'subtitle1'}>{t('sidebar.maintainers.title')}</StyledText>;
  }
};

export default Title;

const StyledText = styled(Typography)<{ theme?: Theme }>(({ theme }) => ({
  fontWeight: theme?.fontWeight.bold,
  marginBottom: '10px',
}));
