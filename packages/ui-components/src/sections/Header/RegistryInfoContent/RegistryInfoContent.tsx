import styled from '@emotion/styled';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { FC } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

import {
  CopyClipboard,
  MIN_RELEASE_AGE_DAYS,
  getBunfigRegistry,
  getCLIChangePassword,
  getCLISBerryYamlRegistry,
  getCLISetConfigRegistry,
  getCLISetRegistry,
  getMinReleaseAgeConfig,
  useConfig,
} from '../../../';
import { externalLinkComponents } from '../../../utils/markdown';
import { Description, TextContent } from './styles';

export const NODE_MANAGER = {
  npm: 'npm',
  yarn: 'yarn',
  pnpm: 'pnpm',
  bun: 'bun',
};

const renderNpmTab = (scope: string | undefined, registryUrl: string): React.JSX.Element => {
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

const renderPnpmTab = (scope: string | undefined, registryUrl: string): React.JSX.Element => {
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

const renderYarnTab = (scope: string | undefined, registryUrl: string): React.JSX.Element => {
  return (
    <Box display="flex" flexDirection="column">
      <CopyClipboard
        dataTestId="copy"
        text={getCLISetConfigRegistry(`${NODE_MANAGER.yarn} config set`, scope, registryUrl)}
      />
    </Box>
  );
};

const renderYarnBerryTab = (scope: string | undefined, registryUrl: string): React.JSX.Element => {
  return (
    <Box display="flex" flexDirection="column">
      <CopyClipboard dataTestId="copy" text={getCLISBerryYamlRegistry(scope, registryUrl)} />
    </Box>
  );
};

const renderBunTab = (scope: string | undefined, registryUrl: string): React.JSX.Element => {
  return (
    <Box display="flex" flexDirection="column">
      <CopyClipboard dataTestId="copy" text={getBunfigRegistry(scope, registryUrl)} />
      <CopyClipboard
        dataTestId="copy"
        text={getCLISetRegistry(`${NODE_MANAGER.bun} publish`, registryUrl)}
      />
    </Box>
  );
};

// shown when the registry sets no web.scope
const PLACEHOLDER_SCOPE = '@your-scope';

const renderMinReleaseAgeTab = (
  managers: string[],
  scope: string,
  t: (key: string) => string
): React.JSX.Element => (
  <Box display="flex" flexDirection="column">
    {managers.map((manager) => (
      <Box data-testid={`min-release-age-${manager}`} key={manager} sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 'bold' }}>{manager}</Typography>
        <Description>{t(`packageManagers.minReleaseAge.${manager}`)}</Description>
        <CopyClipboard dataTestId="copy" text={getMinReleaseAgeConfig(manager, scope)} />
      </Box>
    ))}
  </Box>
);

export const AccordionContainer = styled('div')({
  padding: 0,
  paddingLeft: 0,
  paddingRight: 0,
});

export const CommandContainer = styled('div')({
  padding: 5,
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
  const hasBun = configOptions?.pkgManagers?.includes('bun');
  const minAgeManagers = ['npm', 'pnpm', 'yarn', 'bun'].filter((manager) =>
    configOptions?.pkgManagers?.includes(manager)
  );
  const exampleScope = scope || PLACEHOLDER_SCOPE;
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
              <ReactMarkdown components={externalLinkComponents}>
                {t('packageManagers.yarnclassicDetails')}
              </ReactMarkdown>
            </Description>
            <CommandContainer data-testid={'tab-content'}>
              {renderYarnTab(scope, registryUrl)}
            </CommandContainer>
            <Description>
              <ReactMarkdown components={externalLinkComponents}>
                {t('packageManagers.yarnBerryDetails')}
              </ReactMarkdown>
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

        {hasBun && (
          <Accordion>
            <AccordionSummary
              aria-controls="panel4a-content"
              expandIcon={<ExpandMoreIcon />}
              id="panel4a-header"
            >
              <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>{'bun'}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Description>
                <ReactMarkdown components={externalLinkComponents}>
                  {t('packageManagers.bunDetails')}
                </ReactMarkdown>
              </Description>
              <CommandContainer data-testid={'tab-content'}>
                {renderBunTab(scope, registryUrl)}
              </CommandContainer>
            </AccordionDetails>
          </Accordion>
        )}

        {minAgeManagers.length > 0 && (
          <Accordion data-testid="min-release-age">
            <AccordionSummary
              aria-controls="panel5a-content"
              expandIcon={<ExpandMoreIcon />}
              id="panel5a-header"
            >
              <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                {t('packageManagers.minReleaseAge.title')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Description>
                {t('packageManagers.minReleaseAge.description', {
                  days: MIN_RELEASE_AGE_DAYS,
                  scope: exampleScope,
                })}
              </Description>
              <CommandContainer data-testid={'tab-content'}>
                {renderMinReleaseAgeTab(minAgeManagers, exampleScope, t)}
              </CommandContainer>
              <Description>
                <ReactMarkdown components={externalLinkComponents}>
                  {t('packageManagers.minReleaseAge.registry')}
                </ReactMarkdown>
              </Description>
            </AccordionDetails>
          </Accordion>
        )}
      </AccordionContainer>
    </>
  );
};

export default RegistryInfoContent;
