import styled from '@emotion/styled';
import Tab from '@mui/material/Tab';
import { default as MuiTabs } from '@mui/material/Tabs';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Theme } from '../../Theme';

interface Props {
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
  tabPosition: number;
  showUplinks?: boolean;
}

const DetailContainerTabs: React.FC<Props> = ({ tabPosition, onChange, showUplinks }) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width:599px)');

  return (
    <Tabs
      allowScrollButtonsMobile={true}
      onChange={onChange}
      scrollButtons={isMobile ? 'auto' : false}
      value={tabPosition}
      variant={isMobile ? 'scrollable' : 'fullWidth'}
    >
      <Tab data-testid={'readme-tab'} id={'readme-tab'} label={t('tab.readme')} />
      <Tab data-testid={'dependencies-tab'} id={'dependencies-tab'} label={t('tab.dependencies')} />
      <Tab data-testid={'versions-tab'} id={'versions-tab'} label={t('tab.versions')} />
      {showUplinks && (
        <Tab data-testid={'uplinks-tab'} id={'uplinks-tab'} label={t('tab.uplinks')} />
      )}
    </Tabs>
  );
};

export default DetailContainerTabs;

const Tabs = styled(MuiTabs)<{ theme?: Theme }>({
  marginBottom: 16,
});
