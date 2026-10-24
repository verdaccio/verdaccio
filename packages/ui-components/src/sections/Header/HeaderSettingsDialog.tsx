import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

import type { Theme } from '../../';
import { VERDACCIO_DOCS_URL } from '../../components/DocsLink';
import { CustomHelp, HelpGuide } from '../../components/Help/Help';
import RegistryInfoDialog from '../../components/RegistryInfoDialog';
import { getConfiguration } from '../../configuration';
import { useConfig } from '../../providers';
import { externalLinkComponents } from '../../utils/markdown';
import LanguageSwitch from './LanguageSwitch';
import RegistryInfoContent from './RegistryInfoContent';

interface Props {
  isOpen: boolean;
  onCloseDialog: () => void;
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
      {value === index && <Box sx={{ paddingTop: 3, paddingBottom: 3 }}>{children}</Box>}
    </div>
  );
}

const TextContent = styled('div')<{ theme?: Theme }>(({ theme }) => ({
  padding: '10px 0',
  backgroundColor: theme.palette.background.default,
}));

const HeaderSettingsDialog: React.FC<Props> = ({ onCloseDialog, isOpen }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };
  const configStore = getConfiguration();
  const { scope, base } = configStore;
  const { t } = useTranslation();
  const { configOptions } = useConfig();
  const customHelp = configOptions.help?.trim();
  return (
    <RegistryInfoDialog
      docsUrl={VERDACCIO_DOCS_URL}
      onClose={onCloseDialog}
      open={isOpen}
      title={t('dialog.settings.title')}
    >
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs aria-label="basic tabs example" onChange={handleChange} value={value}>
            <Tab label={t('packageManagers.title')} {...a11yProps(0)} />
            <Tab
              data-testid="settings-publish-tab"
              label={t('help.settings-tab')}
              {...a11yProps(1)}
            />
            <Tab label={t('language.title')} {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel index={0} value={value}>
          <RegistryInfoContent registryUrl={base} scope={scope} />
        </TabPanel>
        {/* the welcome guide stays reachable once the registry has packages */}
        <TabPanel data-testid="settings-publish" index={1} value={value}>
          {customHelp ? <CustomHelp markdown={customHelp} /> : <HelpGuide />}
        </TabPanel>
        <TabPanel index={2} value={value}>
          <TextContent>{t('language.description')}</TextContent>
          <LanguageSwitch />
          <ReactMarkdown components={externalLinkComponents}>
            {t('language.contribute')}
          </ReactMarkdown>
        </TabPanel>
      </Box>
    </RegistryInfoDialog>
  );
};

export default HeaderSettingsDialog;
