import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { Theme } from '../../Theme';
import { PackageDependencies } from '../../types/packageMeta';
import { Route } from '../../utils';

interface DependencyBlockProps {
  title: string;
  dependencies: PackageDependencies;
}

export const StyledText = styled(Typography)<{ theme?: Theme }>((props) => ({
  fontWeight: props.theme.fontWeight.bold,
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
  const deps = Object.entries(dependencies);

  function handleClick(name: string): void {
    history.push(`${Route.DETAIL}${name}`);
  }

  function labelText(title: string, name: string, version: string): string {
    if (title === 'bundleDependencies') {
      return t('dependencies.dependency-block-bundle', { package: name });
    } else {
      return t('dependencies.dependency-block', { package: name, version });
    }
  }

  return (
    <Box data-testid={title} sx={{ margin: 2 }}>
      <StyledText sx={{ marginBottom: 1 }} variant="subtitle1">
        {`${title} (${deps.length})`}
      </StyledText>
      <Tags>
        {deps.map(([name, version]: [string, string]) => {
          // Bundle dependencies are stored as array, for example [ 0: "semver" ]
          // so the package name arrives here in the version field
          const packageName = title == 'bundleDependencies' ? version : name;
          return (
            <Tag
              className={'dep-tag'}
              clickable={true}
              data-testid={packageName}
              key={packageName}
              label={labelText(title, packageName, version)}
              // eslint-disable-next-line
              onClick={() => {
                handleClick(packageName);
              }}
            />
          );
        })}
      </Tags>
    </Box>
  );
};
