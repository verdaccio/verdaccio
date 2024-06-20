import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import NoItems from '../NoItems';
import { DependencyBlock } from './DependencyBlock';
import { hasKeys } from './utits';

const Dependencies: React.FC<{ packageMeta: any }> = ({ packageMeta }) => {
  const { t } = useTranslation();

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
    optionalDependencies,
    bundleDependencies,
  };
  const hasDependencies =
    hasKeys(dependencies) ||
    hasKeys(bundleDependencies) ||
    hasKeys(optionalDependencies) ||
    hasKeys(devDependencies) ||
    hasKeys(peerDependencies);
  if (hasDependencies) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box data-testid="dependencies-box" sx={{ m: 2 }}>
            {Object.entries(dependencyMap).map(([dependencyType, dependencies]) => {
              if (!dependencies || Object.keys(dependencies).length === 0) {
                return null;
              }
              return (
                <Fragment key={dependencyType}>
                  <DependencyBlock
                    dependencies={dependencies}
                    key={dependencyType}
                    title={dependencyType}
                  />
                </Fragment>
              );
            })}
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <NoItems text={t('dependencies.has-no-dependencies', { package: name })} />
      </CardContent>
    </Card>
  );
};

export default Dependencies;
