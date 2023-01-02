import styled from '@emotion/styled';
import Paper from '@mui/material/Paper';
import React from 'react';

import { Theme } from '../../Theme';
import ActionBar from '../../components/ActionBar';
import Author from '../../components/Author';
import Developers, { DeveloperType } from '../../components/Developers';
import FundButton from '../../components/FundButton';
import SideBarTittle from '../../components/SideBarTittle';
import { useConfig } from '../../providers';
import { useVersion } from '../../providers';
import { PackageMetaInterface } from '../../types/packageMeta';
import loadable from '../../utils/loadable';

const Engines = loadable(
  () => import(/* webpackChunkName: "Engines" */ '../../components/Engines')
);
const Dist = loadable(
  () => import(/* webpackChunkName: "Distribution" */ '../../components/Distribution')
);
const Install = loadable(
  () => import(/* webpackChunkName: "Install" */ '../../components/Install')
);
const Repository = loadable(
  () => import(/* webpackChunkName: "Repository" */ '../../components/Repository')
);

const getModuleType = (manifest: PackageMetaInterface) => {
  if (manifest.latest.main) {
    return 'commonjs';
  } else if (manifest.latest.type) {
    return manifest.latest.type;
  }
  return;
};

const DetailSidebar: React.FC = () => {
  const { packageMeta, packageName, packageVersion } = useVersion();
  const { configOptions } = useConfig();
  const version = packageVersion || packageMeta?.latest.version || '';
  const time = packageMeta?.time ? packageMeta.time[version] : '';

  if (!packageMeta || !packageName) {
    return null;
  }

  return (
    <StyledPaper sx={{ position: 'sticky', top: 0 }}>
      <SideBarTittle
        description={packageMeta.latest?.description}
        hasTypes={typeof packageMeta.latest?.types === 'string'}
        isLatest={typeof packageVersion === 'undefined'}
        moduleType={getModuleType(packageMeta)}
        packageName={packageName}
        time={time}
        version={version}
      />
      <ActionBar
        packageMeta={packageMeta}
        showDownloadTarball={configOptions.showDownloadTarball}
        showRaw={configOptions.showRaw}
      />
      <Install configOptions={configOptions} packageMeta={packageMeta} packageName={packageName} />
      <FundButton packageMeta={packageMeta} />
      <Repository packageMeta={packageMeta} />
      <Engines packageMeta={packageMeta} />
      <Dist packageMeta={packageMeta} />
      <Author packageMeta={packageMeta} />
      <Developers packageMeta={packageMeta} type={DeveloperType.MAINTAINERS} />
      <Developers packageMeta={packageMeta} type={DeveloperType.CONTRIBUTORS} />
    </StyledPaper>
  );
};

export default DetailSidebar;

const StyledPaper = styled(Paper)<{ theme?: Theme }>(({ theme }) => ({
  padding: theme?.spacing(3, 2),
}));
