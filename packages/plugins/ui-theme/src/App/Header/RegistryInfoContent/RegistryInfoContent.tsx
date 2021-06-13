import styled from '@emotion/styled';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import CopyToClipBoard from 'verdaccio-ui/components/CopyToClipBoard';
import { useConfig } from 'verdaccio-ui/providers/config';
import {
  getCLISetRegistry,
  getCLIChangePassword,
  getCLISetConfigRegistry,
} from 'verdaccio-ui/utils/cli-utils';
import { NODE_MANAGER } from 'verdaccio-ui/utils/constants';

const renderNpmTab = (scope: string, registryUrl: string): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" p={1}>
      <CopyToClipBoard
        text={getCLISetConfigRegistry(`${NODE_MANAGER.npm} set`, scope, registryUrl)}
      />
      <CopyToClipBoard text={getCLISetRegistry(`${NODE_MANAGER.npm} adduser`, registryUrl)} />
      <CopyToClipBoard text={getCLIChangePassword(NODE_MANAGER.npm, registryUrl)} />
    </Box>
  );
};

const renderPnpmTab = (scope: string, registryUrl: string): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" p={1}>
      <CopyToClipBoard
        text={getCLISetConfigRegistry(`${NODE_MANAGER.pnpm} set`, scope, registryUrl)}
      />
      <CopyToClipBoard text={getCLISetRegistry(`${NODE_MANAGER.pnpm} adduser`, registryUrl)} />
      <CopyToClipBoard text={getCLIChangePassword(NODE_MANAGER.pnpm, registryUrl)} />
    </Box>
  );
};

const renderYarnTab = (scope: string, registryUrl: string): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" p={1}>
      <CopyToClipBoard
        text={getCLISetConfigRegistry(`${NODE_MANAGER.yarn} config set`, scope, registryUrl)}
      />
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightBold,
  },
}));

export const AccordionContainer = styled('div')({
  padding: 30,
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
  scope: string;
};

const RegistryInfoContent: FC<Props> = ({ scope, registryUrl }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { configOptions } = useConfig();

  const hasNpm = configOptions?.pkgManagers?.includes('npm');
  const hasYarn = configOptions?.pkgManagers?.includes('yarn');
  const hasPnpm = configOptions?.pkgManagers?.includes('pnpm');
  const hasPkgManagers = hasNpm | hasPnpm | hasYarn;
  if (!hasPkgManagers || !scope || !registryUrl) {
    return <AccordionContainer>{t('header.registry-no-conf')}</AccordionContainer>;
  }

  return hasPkgManagers ? (
    <AccordionContainer>
      {hasNpm && (
        <Accordion>
          <AccordionSummary
            aria-controls="panel1a-content"
            expandIcon={<ExpandMoreIcon />}
            id="panel1a-header">
            <Typography className={classes.heading}>{'npm'}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CommandContainer data-testid={'tab-content'}>
              {renderNpmTab(scope, registryUrl)}
            </CommandContainer>
          </AccordionDetails>
        </Accordion>
      )}
      {hasYarn && (
        <Accordion>
          <AccordionSummary
            aria-controls="panel2a-content"
            expandIcon={<ExpandMoreIcon />}
            id="panel2a-header">
            <Typography className={classes.heading}>{'yarn'}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CommandContainer data-testid={'tab-content'}>
              {renderYarnTab(scope, registryUrl)}
            </CommandContainer>
          </AccordionDetails>
        </Accordion>
      )}
      {hasPnpm && (
        <Accordion>
          <AccordionSummary
            aria-controls="panel3a-content"
            expandIcon={<ExpandMoreIcon />}
            id="panel3a-header">
            {'pnpm'}
          </AccordionSummary>
          <AccordionDetails>
            <CommandContainer data-testid={'tab-content'}>
              {renderPnpmTab(scope, registryUrl)}
            </CommandContainer>
          </AccordionDetails>
        </Accordion>
      )}
      <LinkContainer>
        <Link href="https://verdaccio.org/docs/en/cli-registry" target="_blank">
          <Typography>{t('header.registry-info-link')}</Typography>
        </Link>
      </LinkContainer>
    </AccordionContainer>
  ) : null;
};

export default RegistryInfoContent;
