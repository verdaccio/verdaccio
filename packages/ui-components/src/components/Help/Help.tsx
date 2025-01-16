import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { CopyClipboard, useConfig } from '../../';
import { Heading } from '../../';
import { CardStyled as Card } from './styles';

function renderHeadingClipboardSegments(title: string, text: string): React.ReactNode {
  return (
    <Fragment>
      <Typography variant={'body1'}>{title}</Typography>
      <CopyClipboard dataTestId="segments" text={text} />
    </Fragment>
  );
}

const Help: React.FC = () => {
  const { configOptions } = useConfig();
  const registryUrl = configOptions.base;
  const { t } = useTranslation();

  return (
    <Card data-testid="help-card" id="help-card">
      <CardContent>
        <Heading gutterBottom={true} id="help-card__title" variant="h5">
          {t('help.title')}
        </Heading>
        <Heading color="textSecondary" gutterBottom={true} sx={{ marginBottom: 1 }}>
          {t('help.sub-title')}
        </Heading>
        {renderHeadingClipboardSegments(
          t('help.first-step'),
          t('help.first-step-command-line', { registryUrl })
        )}
        {renderHeadingClipboardSegments(
          t('help.second-step'),
          t('help.second-step-command-line', { registryUrl })
        )}
        <Typography variant="body1">{t('help.third-step')}</Typography>
      </CardContent>
      <CardActions>
        <Button color="primary" href="https://verdaccio.org/docs/cli-registry" size="small">
          {t('button.learn-more')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default Help;
