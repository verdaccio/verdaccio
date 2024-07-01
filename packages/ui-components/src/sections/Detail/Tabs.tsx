import styled from '@emotion/styled';
import Tab from '@mui/material/Tab';
import { default as MuiTabs } from '@mui/material/Tabs';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Theme } from '../../Theme';

interface Props {
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
  tabPosition: number;
  showUplinks?: boolean;
}

const DetailContainerTabs: React.FC<Props> = ({ tabPosition, onChange, showUplinks }) => {
  const { t } = useTranslation();
  return (
    <Tabs onChange={onChange} value={tabPosition} variant={'fullWidth'}>
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
