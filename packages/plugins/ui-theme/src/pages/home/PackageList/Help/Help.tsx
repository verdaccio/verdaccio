import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import Button from 'verdaccio-ui/components/Button';
import CardActions from 'verdaccio-ui/components/CardActions';
import CardContent from 'verdaccio-ui/components/CardContent';
import CopyToClipBoard from 'verdaccio-ui/components/CopyToClipBoard';
import { default as Typography } from 'verdaccio-ui/components/Heading';
import Text from 'verdaccio-ui/components/Text';
import { getRegistryURL } from 'verdaccio-ui/utils/url';

import { CardStyled as Card, HelpTitle } from './styles';

function renderHeadingClipboardSegments(title: string, text: string): React.ReactNode {
  return (
    <Fragment>
      <Text variant={'body1'}>{title}</Text>
      <CopyToClipBoard text={text} />
    </Fragment>
  );
}

const Help: React.FC = () => {
  const registryUrl = getRegistryURL();
  const { t } = useTranslation();

  return (
    <Card id="help-card">
      <CardContent>
        <Typography gutterBottom={true} id="help-card__title" variant="h5">
          {t('help.title')}
        </Typography>
        <HelpTitle color="textSecondary" gutterBottom={true}>
          {t('help.sub-title')}
        </HelpTitle>
        {renderHeadingClipboardSegments(
          t('help.first-step'),
          t('help.first-step-command-line', { registryUrl })
        )}
        {renderHeadingClipboardSegments(
          t('help.second-step'),
          t('help.second-step-command-line', { registryUrl })
        )}
        <Text variant="body2">{t('help.third-step')}</Text>
      </CardContent>
      <CardActions>
        <Button color="primary" href="https://verdaccio.org/docs/en/installation" size="small">
          {t('button.learn-more')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default Help;
