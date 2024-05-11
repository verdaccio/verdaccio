/* eslint-disable verdaccio/jsx-spread */
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React from 'react';

import RegistryInfoDialog from '../RegistryInfoDialog';

interface Props {
  isOpen: boolean;
  onCloseDialog: () => void;
  tabPanels: any;
  tabs: any;
  dialogTitle: string;
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      aria-labelledby={`simple-tab-${index}`}
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      role="tabpanel"
      {...other}
    >
      {value === index && <Box sx={{ paddingTop: 3 }}>{children}</Box>}
    </div>
  );
}

const HeaderInfoDialog: React.FC<Props> = ({
  onCloseDialog,
  isOpen,
  tabs = null,
  tabPanels = null,
  dialogTitle,
}) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };

  return (
    <RegistryInfoDialog onClose={onCloseDialog} open={isOpen} title={dialogTitle}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs aria-label="infoTabs" onChange={handleChange} value={value}>
            {tabs
              ? tabs.map((item, index) => {
                  return (
                    <Tab key={item.label} label={item.label} {...a11yProps(index)} {...item} />
                  );
                })
              : null}
          </Tabs>
        </Box>

        {tabPanels
          ? tabPanels.map((item, index) => {
              return (
                <TabPanel index={index} key={index} value={value}>
                  {item.element}
                </TabPanel>
              );
            })
          : null}
      </Box>
    </RegistryInfoDialog>
  );
};

export default HeaderInfoDialog;
