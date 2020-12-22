import styled from '@emotion/styled';
import React, { useContext } from 'react';

import ActionBar from 'verdaccio-ui/components/ActionBar';
import Author from 'verdaccio-ui/components/Author';
import Paper from 'verdaccio-ui/components/Paper';
import { Theme } from 'verdaccio-ui/design-tokens/theme';

import { DetailContext } from '..';
import loadable from '../../../App/utils/loadable';

import DetailSidebarFundButton from './DetailSidebarFundButton';
import DetailSidebarTitle from './DetailSidebarTitle';
import Developers, { DeveloperType } from './Developers';

const Engines = loadable(() => import(/* webpackChunkName: "Engines" */ './Engines'));
const Dist = loadable(() => import(/* webpackChunkName: "Dist" */ './Dist'));
const Install = loadable(() => import(/* webpackChunkName: "Install" */ './Install'));
const Repository = loadable(() => import(/* webpackChunkName: "Repository" */ './Repository'));

const DetailSidebar: React.FC = () => {
  const detailContext = useContext(DetailContext);
  const { packageMeta, packageName, packageVersion } = detailContext;

  if (!packageMeta || !packageName) {
    return null;
  }

  return (
    <StyledPaper className={'sidebar-info'}>
      <DetailSidebarTitle
        description={packageMeta.latest?.description}
        isLatest={typeof packageVersion === 'undefined'}
        packageName={packageName}
        version={packageVersion || packageMeta.latest.version}
      />
      <ActionBar />
      <Install />
      <DetailSidebarFundButton />
      <Repository />
      <Engines />
      <Dist />
      <Author />
      <Developers type={DeveloperType.MAINTAINERS} />
      <Developers type={DeveloperType.CONTRIBUTORS} />
    </StyledPaper>
  );
};

export default DetailSidebar;

const StyledPaper = styled(Paper)<{ theme?: Theme }>(({ theme }) => ({
  padding: theme?.spacing(3, 2),
}));
