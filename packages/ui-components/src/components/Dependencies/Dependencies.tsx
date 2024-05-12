import styled from '@emotion/styled';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { Theme } from '../../Theme';
import NoItems from '../NoItems';
import { DependencyBlock } from './DependencyBlock';
import { hasKeys } from './utits';

export const CardWrap = styled(Card)<{ theme?: Theme }>((props) => ({
  marginBottom: props.theme.spacing(2),
}));

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
      <CardWrap>
        <CardContent>
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
        </CardContent>
      </CardWrap>
    );
  }

  return (
    <CardWrap>
      <CardContent>
        <NoItems text={t('dependencies.has-no-dependencies', { package: name })} />
      </CardContent>
    </CardWrap>
  );
};

export default Dependencies;
