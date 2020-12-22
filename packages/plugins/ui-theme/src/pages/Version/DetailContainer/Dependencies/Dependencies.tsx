import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import CardContent from 'verdaccio-ui/components/CardContent';

import { PackageDependencies } from '../../../../../types/packageMeta';
import { DetailContext } from '../../context';
import NoItems from '../NoItems';

import { CardWrap, StyledText, Tags, Tag } from './styles';

interface DependencyBlockProps {
  title: string;
  dependencies: PackageDependencies;
}

const DependencyBlock: React.FC<DependencyBlockProps> = ({ title, dependencies }) => {
  const { enableLoading } = useContext(DetailContext);
  const history = useHistory();
  const { t } = useTranslation();

  const deps = Object.entries(dependencies);

  function handleClick(name: string): void {
    enableLoading && enableLoading();

    history.push(`/-/web/detail/${name}`);
  }

  return (
    <CardWrap>
      <CardContent>
        <StyledText variant="subtitle1">{`${title} (${deps.length})`}</StyledText>
        <Tags>
          {deps.map(([name, version]) => (
            <Tag
              className={'dep-tag'}
              clickable={true}
              key={name}
              label={t('dependencies.dependency-block', { package: name, version })}
              // eslint-disable-next-line
              onClick={() => handleClick(name)}
            />
          ))}
        </Tags>
      </CardContent>
    </CardWrap>
  );
};

function hasKeys(object?: { [key: string]: any }): boolean {
  return !!object && Object.keys(object).length > 0;
}

const Dependencies: React.FC<{}> = () => {
  const { packageMeta } = useContext(DetailContext);
  const { t } = useTranslation();

  if (!packageMeta) {
    throw new Error(t('error.package-meta-is-required-at-detail-context'));
  }

  const { latest } = packageMeta;
  // FIXME: add dependencies to package meta type
  // @ts-ignore
  const { dependencies, devDependencies, peerDependencies, name } = latest;
  const dependencyMap = { dependencies, devDependencies, peerDependencies };
  const hasDependencies =
    hasKeys(dependencies) || hasKeys(devDependencies) || hasKeys(peerDependencies);

  if (hasDependencies) {
    return (
      <>
        {Object.entries(dependencyMap).map(([dependencyType, dependencies]) => {
          if (!dependencies || Object.keys(dependencies).length === 0) {
            return null;
          }

          return (
            <DependencyBlock
              dependencies={dependencies}
              key={dependencyType}
              title={dependencyType}
            />
          );
        })}
      </>
    );
  }

  return (
    <NoItems
      className="no-dependencies"
      text={t('dependencies.has-no-dependencies', { package: name })}
    />
  );
};

export default Dependencies;
