import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { Theme } from '../../Theme';
import { PackageDependencies } from '../../types/packageMeta';

interface DependencyBlockProps {
  title: string;
  dependencies: PackageDependencies;
}

export const StyledText = styled(Typography)<{ theme?: Theme }>((props) => ({
  fontWeight: props.theme && props.theme.fontWeight.bold,
  textTransform: 'capitalize',
}));

export const Tags = styled('div')<{ theme?: Theme }>((props) => ({
  display: 'flex',
  justifyContent: 'start',
  flexWrap: 'wrap',
  // force title to be on the same line as the title
  // could be better to avoid margin on the first element
  // but it is a bit tricky to do with flexbox
  marginLeft: props.theme.spacing(-0.6),
}));

export const Tag = styled(Chip)<{ theme?: Theme }>((props) => ({
  margin: props.theme.spacing(0.6),
}));

export const DependencyBlock: React.FC<DependencyBlockProps> = ({ title, dependencies }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const theme = useTheme();
  const deps = Object.entries(dependencies);

  function handleClick(name: string): void {
    history.push(`/-/web/detail/${name}`);
  }

  return (
    <Box data-testid={title} sx={{ margin: theme.spacing(2) }}>
      <StyledText sx={{ marginBottom: theme.spacing(1) }} variant="subtitle1">
        {`${title} (${deps.length})`}
      </StyledText>
      <Tags>
        {deps.map(([name, version]) => (
          <Tag
            className={'dep-tag'}
            clickable={true}
            data-testid={name}
            key={name}
            label={t('dependencies.dependency-block', { package: name, version })}
            // eslint-disable-next-line
            onClick={() => {
              handleClick(name);
            }}
          />
        ))}
      </Tags>
    </Box>
  );
};
