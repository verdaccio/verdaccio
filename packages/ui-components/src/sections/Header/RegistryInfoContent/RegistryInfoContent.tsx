import styled from '@emotion/styled';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

import {
  CopyClipboard,
  getCLIChangePassword,
  getCLISBerryYamlRegistry,
  getCLISetConfigRegistry,
  getCLISetRegistry,
  useConfig,
} from '../../../';
import { Description, TextContent } from './styles';

export const NODE_MANAGER = {
  npm: 'npm',
  yarn: 'yarn',
  pnpm: 'pnpm',
};

const renderNpmTab = (scope: string | undefined, registryUrl: string): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column">
      <CopyClipboard
        dataTestId="copy"
        text={getCLISetConfigRegistry(`${NODE_MANAGER.npm} set`, scope, registryUrl)}
      />
      <CopyClipboard
        dataTestId="copy"
        text={getCLISetRegistry(`${NODE_MANAGER.npm} adduser`, registryUrl)}
      />
      <CopyClipboard dataTestId="copy" text={getCLIChangePassword(NODE_MANAGER.npm, registryUrl)} />
    </Box>
  );
};

const renderPnpmTab = (scope: string | undefined, registryUrl: string): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column">
      <CopyClipboard
        dataTestId="copy"
        text={getCLISetConfigRegistry(`${NODE_MANAGER.pnpm} set`, scope, registryUrl)}
      />
      <CopyClipboard
        dataTestId="copy"
        text={getCLISetRegistry(`${NODE_MANAGER.pnpm} adduser`, registryUrl)}
      />
      <CopyClipboard
        dataTestId="copy"
        text={getCLIChangePassword(NODE_MANAGER.pnpm, registryUrl)}
      />
    </Box>
  );
};

const renderYarnTab = (scope: string | undefined, registryUrl: string): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column">
      <CopyClipboard
        dataTestId="copy"
        text={getCLISetConfigRegistry(`${NODE_MANAGER.yarn} config set`, scope, registryUrl)}
      />
    </Box>
  );
};

const renderYarnBerryTab = (scope: string | undefined, registryUrl: string): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column">
      <CopyClipboard dataTestId="copy" text={getCLISBerryYamlRegistry(scope, registryUrl)} />
    </Box>
  );
};

export const AccordionContainer = styled('div')({
  padding: 0,
  paddingLeft: 0,
  paddingRight: 0,
});

export const CommandContainer = styled('div')({
  padding: 5,
});

export const LinkContainer = styled('div')({
  margin: 10,
  marginLeft: 0,
});

export type Props = {
  registryUrl: string;
  scope: string | undefined;
};

const RegistryInfoContent: FC<Props> = ({ scope, registryUrl }) => {
  const { t } = useTranslation();
  const { configOptions } = useConfig();

  const hasNpm = configOptions?.pkgManagers?.includes('npm');
  const hasYarn = configOptions?.pkgManagers?.includes('yarn');
  const hasPnpm = configOptions?.pkgManagers?.includes('pnpm');
  // TODO: we can improve this logic, expanding only one accordion based on which package manager is enabled
  // feel free to contribute here
  return (
    <>
      <TextContent>{t('packageManagers.description')}</TextContent>
      <AccordionContainer>
        <Accordion disabled={!hasNpm}>
          <AccordionSummary
            aria-controls="panel1a-content"
            expandIcon={<ExpandMoreIcon />}
            id="panel1a-header"
          >
            <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>{'npm'}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CommandContainer data-testid={'tab-content'}>
              {renderNpmTab(scope, registryUrl)}
            </CommandContainer>
          </AccordionDetails>
        </Accordion>
        <Accordion disabled={!hasYarn}>
          <AccordionSummary
            aria-controls="panel2a-content"
            expandIcon={<ExpandMoreIcon />}
            id="panel2a-header"
          >
            <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>{'yarn'}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Description>
              <ReactMarkdown>{t('packageManagers.yarnclassicDetails')}</ReactMarkdown>
            </Description>
            <CommandContainer data-testid={'tab-content'}>
              {renderYarnTab(scope, registryUrl)}
            </CommandContainer>
            <Description>
              <ReactMarkdown>{t('packageManagers.yarnBerryDetails')}</ReactMarkdown>
            </Description>
            <CommandContainer data-testid={'tab-content'}>
              {renderYarnBerryTab(scope, registryUrl)}
            </CommandContainer>
          </AccordionDetails>
        </Accordion>

        <Accordion disabled={!hasPnpm}>
          <AccordionSummary
            aria-controls="panel3a-content"
            expandIcon={<ExpandMoreIcon />}
            id="panel3a-header"
          >
            <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>{'pnpm'}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CommandContainer data-testid={'tab-content'}>
              {renderPnpmTab(scope, registryUrl)}
            </CommandContainer>
          </AccordionDetails>
        </Accordion>

        <LinkContainer>
          <Link href="https://verdaccio.org/docs/en/cli-registry" target="_blank">
            <Typography>{t('header.registry-info-link')}</Typography>
          </Link>
        </LinkContainer>
      </AccordionContainer>
    </>
  );
};

export default RegistryInfoContent;
