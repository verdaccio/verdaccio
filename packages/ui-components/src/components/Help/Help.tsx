import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

import { CopyClipboard, Heading, useConfig } from '../../';
import DocsLink from '../DocsLink';
import {
  getBunfigRegistry,
  getCLISBerryYamlRegistry,
  getCLISetConfigRegistry,
  getCLISetRegistry,
  getNpmrcRegistry,
} from '../../utils/cli-utils';
import { externalLinkComponents } from '../../utils/markdown';
import {
  CardStyled as Card,
  CommandBox,
  CustomHelpContent,
  Step,
  StepList,
  StepNumber,
} from './styles';

const NPMRC = '.npmrc';
const SETUP_TABS = ['npm', 'pnpm', 'yarn', 'bun', NPMRC] as const;
type SetupTab = (typeof SETUP_TABS)[number];

const DOCS_UPLINKS_URL = 'https://verdaccio.org/docs/uplinks';

/** The one-time command that makes a client use this registry, honouring `web.scope`. */
export function getSetupCommand(tab: SetupTab, scope: string | undefined, registryUrl: string) {
  switch (tab) {
    case 'npm':
      return getCLISetConfigRegistry('npm config set', scope, registryUrl);
    case 'pnpm':
      return getCLISetConfigRegistry('pnpm config set', scope, registryUrl);
    case 'yarn':
      return getCLISBerryYamlRegistry(scope, registryUrl).trim();
    case 'bun':
      return getBunfigRegistry(scope, registryUrl);
    default:
      return getNpmrcRegistry(scope, registryUrl);
  }
}

const Command: React.FC<{ dataTestId: string; text: string }> = ({ dataTestId, text }) => (
  <CommandBox>
    <CopyClipboard dataTestId={dataTestId} text={text}>
      <code>{text}</code>
    </CopyClipboard>
  </CommandBox>
);

const HelpStep: React.FC<{
  index: number;
  title: string;
  description?: string;
  children?: React.ReactNode;
}> = ({ index, title, description, children }) => (
  <Step>
    <StepNumber aria-hidden={true}>{index}</StepNumber>
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography component="h3" sx={{ fontWeight: 600 }} variant="subtitle1">
        {title}
      </Typography>
      {description && (
        <Typography color="text.secondary" variant="body2">
          {description}
        </Typography>
      )}
      {children}
    </Box>
  </Step>
);

/** The markdown that `web.help` sets, with `{{registryUrl}}` filled in. */
export const CustomHelp: React.FC<{ markdown: string }> = ({ markdown }) => {
  const { configOptions } = useConfig();
  return (
    <CustomHelpContent data-testid="help-custom">
      <ReactMarkdown components={externalLinkComponents}>
        {markdown.replaceAll('{{registryUrl}}', configOptions.base)}
      </ReactMarkdown>
    </CustomHelpContent>
  );
};

/** The steps to point a client at the registry, log in and publish; shared by the welcome card and the settings. */
export const HelpGuide: React.FC<{ withWaitStep?: boolean; labelledBy?: string }> = ({
  withWaitStep = false,
  labelledBy,
}) => {
  const { configOptions } = useConfig();
  const { t } = useTranslation();
  const registryUrl = configOptions.base;
  const scope = configOptions.scope || undefined;
  const setupTabs = SETUP_TABS.filter(
    (tab) => tab === NPMRC || configOptions.pkgManagers?.includes(tab)
  );
  const hasBun = configOptions.pkgManagers?.includes('bun');
  const [setupTab, setSetupTab] = useState<SetupTab>(setupTabs[0]);
  const steps: { key: string; title: string; description?: string; body?: React.ReactNode }[] = [
    {
      key: 'configure',
      title: t('help.steps.configure.title'),
      description: t('help.steps.configure.description'),
      body: (
        <>
          <Tabs
            allowScrollButtonsMobile={true}
            aria-label={t('help.steps.configure.title')}
            onChange={(_event, value: SetupTab) => setSetupTab(value)}
            sx={{ minHeight: 36, mt: 1 }}
            scrollButtons="auto"
            value={setupTab}
            variant="scrollable"
          >
            {setupTabs.map((tab) => (
              <Tab
                data-testid={`help-setup-${tab}`}
                key={tab}
                label={tab}
                sx={{ minHeight: 36, minWidth: 0, px: 1.5, py: 0, textTransform: 'none' }}
                value={tab}
              />
            ))}
          </Tabs>
          <Command
            dataTestId="help-setup-command"
            text={getSetupCommand(setupTab, scope, registryUrl)}
          />
        </>
      ),
    },
  ];
  if (configOptions.login) {
    steps.push({
      key: 'login',
      title: t('help.steps.login.title'),
      description: t('help.steps.login.description'),
      body: (
        <>
          <Command
            dataTestId="help-login-command"
            text={t('help.first-step-command-line', { registryUrl })}
          />
          {hasBun && (
            <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
              {t('help.steps.login.bun-note')}
            </Typography>
          )}
        </>
      ),
    });
  }
  steps.push({
    key: 'publish',
    title: t('help.steps.publish.title'),
    description: t('help.steps.publish.description'),
    body: (
      <>
        <Command
          dataTestId="help-publish-command"
          text={t('help.second-step-command-line', { registryUrl })}
        />
        {hasBun && (
          <Command
            dataTestId="help-publish-command-bun"
            text={getCLISetRegistry('bun publish', registryUrl)}
          />
        )}
      </>
    ),
  });
  if (withWaitStep) {
    steps.push({
      key: 'wait',
      title: t('help.steps.wait.title'),
      description: t('help.steps.wait.description'),
    });
  }

  return (
    <>
      <StepList aria-labelledby={labelledBy} data-testid="help-guide">
        {steps.map((step, index) => (
          <HelpStep
            description={step.description}
            index={index + 1}
            key={step.key}
            title={step.title}
          >
            {step.body}
          </HelpStep>
        ))}
      </StepList>
      {/* @ts-ignore - Alert does accept children despite the type error */}
      <Alert data-testid="help-uplinks-note" severity="info" sx={{ mt: 3 }}>
        {t('help.uplinks-note')}{' '}
        <Link href={DOCS_UPLINKS_URL} rel="noopener noreferrer" target="_blank">
          {t('help.uplinks-link')}
        </Link>
      </Alert>
    </>
  );
};

const Help: React.FC = () => {
  const { configOptions } = useConfig();
  const { t } = useTranslation();
  const customHelp = configOptions.help?.trim();
  if (customHelp) {
    return (
      <Card data-testid="help-card" id="help-card">
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <CustomHelp markdown={customHelp} />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card data-testid="help-card" id="help-card">
      <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
        <Box
          sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 3 }}
        >
          <Inventory2Outlined
            color="primary"
            sx={{ fontSize: { xs: 32, sm: 48 }, flexShrink: 0 }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Heading
              id="help-card__title"
              sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, lineHeight: 1.3 }}
              variant="h5"
            >
              {t('help.title')}
            </Heading>
            <Typography color="text.secondary">
              {t('help.welcome', { title: configOptions.title })}
            </Typography>
          </Box>
        </Box>
        <HelpGuide labelledBy="help-card__title" withWaitStep={true} />
      </CardContent>
      <CardActions sx={{ px: { xs: 2, sm: 4 }, pb: 3 }}>
        <DocsLink dataTestId="help-docs-link" />
      </CardActions>
    </Card>
  );
};

export default Help;
