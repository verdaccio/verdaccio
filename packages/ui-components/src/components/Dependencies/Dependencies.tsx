import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { PackageDependencies } from '../../types/packageMeta';
import NoItems from '../NoItems';
import { CardWrap, StyledText, Tag, Tags } from './styles';

interface DependencyBlockProps {
  title: string;
  dependencies: PackageDependencies;
  enableLoading?: () => void;
}

const DependencyBlock: React.FC<DependencyBlockProps> = ({
  title,
  dependencies,
  enableLoading,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const theme = useTheme();

  const deps = Object.entries(dependencies);

  function handleClick(name: string): void {
    enableLoading?.();

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
            onClick={() => handleClick(name)}
          />
        ))}
      </Tags>
    </Box>
  );
};

function hasKeys(object?: { [key: string]: any }): boolean {
  return !!object && Object.keys(object).length > 0;
}

const Dependencies: React.FC<{ packageMeta: any }> = ({ packageMeta }) => {
  const { t } = useTranslation();

  if (!packageMeta) {
    throw new Error(t('error.package-meta-is-required-at-detail-context'));
  }

  const { latest } = packageMeta;
  // FIXME: add dependencies to package meta type
  // @ts-ignore
  const {
    dependencies,
    devDependencies,
    peerDependencies,
    optionalDependencies,
    bundleDependencies,
    name,
  } = latest;
  const dependencyMap = {
    dependencies,
    devDependencies,
    peerDependencies,
    bundleDependencies,
    optionalDependencies,
  };
  const hasDependencies =
    hasKeys(dependencies) ||
    hasKeys(bundleDependencies) ||
    hasKeys(optionalDependencies) ||
    hasKeys(devDependencies) ||
    hasKeys(peerDependencies);
  if (hasDependencies) {
    return (
      <CardWrap>
        <CardContent>
          {Object.entries(dependencyMap).map(([dependencyType, dependencies]) => {
            if (!dependencies || Object.keys(dependencies).length === 0) {
              return null;
            }
            return (
              <>
                <DependencyBlock
                  dependencies={dependencies}
                  key={dependencyType}
                  title={dependencyType}
                />
              </>
            );
          })}
        </CardContent>
      </CardWrap>
    );
  }

  return <NoItems text={t('dependencies.has-no-dependencies', { package: name })} />;
};

export default Dependencies;
