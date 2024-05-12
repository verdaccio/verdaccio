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
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const deps = Object.entries(dependencies);

  function handleClick(name: string): void {
    history.push(`/-/web/detail/${name}`);
  }

  function labelText(title: string, name: string, version: string): string {
    // Bundle dependencies don't have a version
    if (title === 'bundleDependencies') {
      return t('dependencies.dependency-block-bundle', { package: name });
    } else {
      return t('dependencies.dependency-block', { package: name, version });
    }
  }

  return (
    <Box data-testid={title} sx={{ margin: theme.spacing(2) }}>
      <StyledText sx={{ marginBottom: theme.spacing(1) }} variant="subtitle1">
        {`${title} (${deps.length})`}
      </StyledText>
      <Tags>
        {deps.map(([name, version]: [string, string]) => (
          <Tag
            className={'dep-tag'}
            clickable={true}
            data-testid={name}
            key={name}
            label={labelText(title, name, version)}
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
