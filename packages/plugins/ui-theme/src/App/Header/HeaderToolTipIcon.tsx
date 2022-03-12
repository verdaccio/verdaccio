import Help from '@mui/icons-material/Help';
import Info from '@mui/icons-material/Info';
import NightsStay from '@mui/icons-material/NightsStay';
import Search from '@mui/icons-material/Search';
import WbSunny from '@mui/icons-material/WbSunny';
import IconButton from '@mui/material/IconButton';
import React, { forwardRef } from 'react';

import { IconSearchButton, StyledLink } from './styles';

export type TooltipIconType = 'search' | 'help' | 'info' | 'dark-mode' | 'light-mode';
interface Props {
  tooltipIconType: TooltipIconType;
  onClick?: () => void;
}

type HeaderToolTipIconRef = HTMLButtonElement;

/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/display-name */
const HeaderToolTipIcon = forwardRef<HeaderToolTipIconRef, Props>(function HeaderToolTipIcon(
  { tooltipIconType, onClick },
  ref
) {
  switch (tooltipIconType) {
    case 'help':
      return (
        <StyledLink
          data-testid={'header--tooltip-documentation'}
          external={true}
          to={'https://verdaccio.org/docs/en/installation'}
        >
          <IconButton color={'inherit'} size="large">
            <Help />
          </IconButton>
        </StyledLink>
      );
    case 'info':
      return (
        <IconButton
          color="inherit"
          data-testid={'header--tooltip-info'}
          id="header--button-registryInfo"
          onClick={onClick}
          ref={ref}
          size="large"
        >
          <Info />
        </IconButton>
      );
    case 'search':
      return (
        <IconSearchButton color="inherit" onClick={onClick} ref={ref}>
          <Search />
        </IconSearchButton>
      );
    case 'dark-mode':
      return (
        <IconButton color="inherit" onClick={onClick} ref={ref} size="large">
          <NightsStay />
        </IconButton>
      );

    case 'light-mode':
      return (
        <IconButton color="inherit" onClick={onClick} ref={ref} size="large">
          <WbSunny />
        </IconButton>
      );
    default:
      return null;
  }
});

export default HeaderToolTipIcon;
