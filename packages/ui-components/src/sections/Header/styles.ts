import { css } from '@emotion/react';
import styled from '@emotion/styled';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { common } from '@mui/material/colors';

import type { Theme } from '../../Theme';

export const InnerNavBar = styled(Toolbar)({
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 0,
});

export const Greetings = styled('span')({
  margin: '0 5px 0 0',
});

export const MobileNavBar = styled('div')<{ theme?: Theme }>((props) => ({
  alignItems: 'center',
  display: 'flex',
  borderBottom: `1px solid ${props.theme.palette.greyLight}`,
  padding: '8px',
  position: 'relative',
}));

export const InnerMobileNavBar = styled('div')<{ theme?: Theme }>((props) => ({
  borderRadius: '4px',
  backgroundColor: props.theme.palette.greyLight,
  color: common.white,
  width: '100%',
  padding: '0 5px',
  margin: '0 10px 0 0',
}));

export const IconSearchButton = styled(IconButton)({});
export const InfoButton = styled(IconButton)({});
export const SwitchThemeButton = styled(IconButton)({});
export const SettingsButtom = styled(IconButton)({});

export const SearchWrapper = styled('div')({
  display: 'none',
  width: '100%',
  marginLeft: 20,
});

export const NavBar = styled(AppBar)<{ theme?: Theme }>(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.cyanBlue,
  color: common.white,
  minHeight: 60,
  display: 'flex',
  justifyContent: 'center',
  [`@media (max-width: ${theme.breakPoints.xsmall}px)`]: css`
    [data-testid='header--tooltip-info'] {
      display: none;
    }
    [data-testid='header--button--dark'],
    [data-testid='header--button--light'] {
      display: none;
    }
    [data-testid='header--tooltip-settings'] {
      display: none;
    }
  `,
  [`@media (min-width: ${theme.breakPoints.medium}px)`]: css`
    [data-testid='search-container'] {
      display: flex;
    }
    [data-testid='header--tooltip-search'] {
      display: none;
    }
    [data-testid='mobile-nav-bar'] {
      display: none;
    }
  `,
  [`@media (min-width: ${theme.breakPoints.large}px)`]: css`
    [data-testid='inner-nav-bar'] {
      padding: 0 16px;
    }
  `,
  [`@media (min-width: ${theme.breakPoints.xlarge}px)`]: css`
    [data-testid='inner-nav-bar'] {
      max-width: 1240px;
      width: 100%;
      margin: 0 auto;
    }
  `,
}));
