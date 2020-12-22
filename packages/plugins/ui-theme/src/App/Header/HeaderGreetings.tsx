import React from 'react';
import { useTranslation } from 'react-i18next';

import Label from 'verdaccio-ui/components/Label';

import { Greetings } from './styles';

interface Props {
  username: string;
}

const HeaderGreetings: React.FC<Props> = ({ username }) => {
  const { t } = useTranslation();
  return (
    <>
      <Greetings>{t('header.greetings')}</Greetings>
      <Label capitalize={true} data-testid="greetings-label" text={username} weight="bold" />
    </>
  );
};

export default HeaderGreetings;
