import styled from '@emotion/styled';
import Favorite from '@material-ui/icons/Favorite';
import React, { useContext } from 'react';
import { Trans } from 'react-i18next';

import Button from 'verdaccio-ui/components/Button';
import Link from 'verdaccio-ui/components/Link';
import { Theme } from 'verdaccio-ui/design-tokens/theme';
import { isURL } from 'verdaccio-ui/utils/url';

import { DetailContext } from '..';

/* eslint-disable react/jsx-no-bind */
const DetailSidebarFundButton: React.FC = () => {
  const detailContext = useContext(DetailContext);

  const { packageMeta } = detailContext;

  const fundingUrl = packageMeta?.latest?.funding?.url as string;

  if (!isURL(fundingUrl)) {
    return null;
  }

  return (
    <StyledLink external={true} to={fundingUrl}>
      <Button
        color="primary"
        fullWidth={true}
        startIcon={<StyledFavoriteIcon />}
        variant="outlined">
        <Trans components={[<StyledFundStrong key="fund" />]} i18nKey="button.fund-this-package" />
      </Button>
    </StyledLink>
  );
};

export default DetailSidebarFundButton;

const StyledLink = styled(Link)<{ theme?: Theme }>(({ theme }) => ({
  marginTop: theme?.spacing(1),
  marginBottom: theme?.spacing(1),
  textDecoration: 'none',
  display: 'block',
}));

const StyledFavoriteIcon = styled(Favorite)<{ theme?: Theme }>(({ theme }) => ({
  color: theme?.palette.orange,
}));

const StyledFundStrong = styled('strong')({
  marginRight: 3,
});
