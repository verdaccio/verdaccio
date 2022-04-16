import Info from '@mui/icons-material/Info';
import NightsStay from '@mui/icons-material/NightsStay';
import Search from '@mui/icons-material/Search';
import Settings from '@mui/icons-material/Settings';
import WbSunny from '@mui/icons-material/WbSunny';
import React, { forwardRef } from 'react';

import { IconSearchButton, InfoButton, SettingsButtom, SwitchThemeButton } from './styles';

export type TooltipIconType = 'search' | 'info' | 'dark-mode' | 'light-mode' | 'settings';
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
    case 'info':
      return (
        <InfoButton
          color="inherit"
          data-testid={'header--tooltip-info'}
          id="header--button-registryInfo"
          onClick={onClick}
          ref={ref}
          size="large"
        >
          <Info />
        </InfoButton>
      );
    case 'settings':
      return (
        <SettingsButtom
          color="inherit"
          data-testid={'header--tooltip-settings'}
          id="header--button-settings"
          onClick={onClick}
          ref={ref}
          size="large"
        >
          <Settings />
        </SettingsButtom>
      );
    case 'search':
      return (
        <IconSearchButton color="inherit" onClick={onClick} ref={ref}>
          <Search />
        </IconSearchButton>
      );
    case 'dark-mode':
      return (
        <SwitchThemeButton
          color="inherit"
          data-testid={'header--button--dark'}
          onClick={onClick}
          ref={ref}
          size="large"
        >
          <NightsStay />
        </SwitchThemeButton>
      );

    case 'light-mode':
      return (
        <SwitchThemeButton
          color="inherit"
          data-testid={'header--button--light'}
          onClick={onClick}
          ref={ref}
          size="large"
        >
          <WbSunny />
        </SwitchThemeButton>
      );
    default:
      return null;
  }
});

export default HeaderToolTipIcon;
