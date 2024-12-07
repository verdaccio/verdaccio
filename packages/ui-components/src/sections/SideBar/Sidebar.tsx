import Paper from '@mui/material/Paper';
import React from 'react';

import ActionBar from '../../components/ActionBar';
import Author from '../../components/Author';
import Developers, { DeveloperType } from '../../components/Developers';
import Dist from '../../components/Distribution';
import Engines from '../../components/Engines';
import FundButton from '../../components/FundButton';
import Install from '../../components/Install';
import Keywords from '../../components/Keywords';
import Repository from '../../components/Repository';
import SideBarTitle from '../../components/SideBarTitle';
import { useConfig } from '../../providers';
import { useVersion } from '../../providers';
import { PackageMetaInterface } from '../../types/packageMeta';

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
    <Paper data-testid="sidebar" sx={{ position: 'sticky', top: 0, p: 2, ml: 2 }}>
      <SideBarTitle
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
      <FundButton packageMeta={packageMeta} />
      <Install configOptions={configOptions} packageMeta={packageMeta} packageName={packageName} />
      <Repository packageMeta={packageMeta} />
      <Engines packageMeta={packageMeta} />
      <Dist packageMeta={packageMeta} />
      <Keywords packageMeta={packageMeta} />
      <Author packageMeta={packageMeta} />
      <Developers packageMeta={packageMeta} type={DeveloperType.MAINTAINERS} />
      <Developers packageMeta={packageMeta} type={DeveloperType.CONTRIBUTORS} />
    </Paper>
  );
};

export default DetailSidebar;
