import styled from '@emotion/styled';
import Favorite from '@mui/icons-material/Favorite';
import Button from '@mui/material/Button';
import React from 'react';
import { Trans } from 'react-i18next';

import { Theme } from '../../Theme';
import { url } from '../../utils';
import { LinkExternal } from '../LinkExternal';

const StyledLink = styled(LinkExternal)<{ theme?: Theme }>(({ theme }) => ({
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

/* eslint-disable react/jsx-no-bind */
const FundButton: React.FC<{ packageMeta: any }> = ({ packageMeta }) => {
  const fundingUrl = packageMeta?.latest?.funding?.url as string;

  if (!url.isURL(fundingUrl)) {
    return null;
  }

  return (
    <StyledLink to={fundingUrl} variant="button">
      <Button
        color="primary"
        fullWidth={true}
        startIcon={<StyledFavoriteIcon />}
        variant="outlined"
      >
        <Trans components={[<StyledFundStrong key="fund" />]} i18nKey="button.fund-this-package" />
      </Button>
    </StyledLink>
  );
};

export default FundButton;
