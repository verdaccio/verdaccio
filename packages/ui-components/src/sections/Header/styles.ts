import { css } from '@emotion/react';
import styled from '@emotion/styled';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';

import { Link, Theme } from '../../';

export const InnerNavBar = styled(Toolbar)({
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 0,
});

export const Greetings = styled('span')({
  margin: '0 5px 0 0',
});

export const RightSide = styled(Toolbar)({
  display: 'flex',
  padding: 0,
  marginRight: 0,
});

export const LeftSide = styled(Toolbar)({
  display: 'flex',
  padding: 0,
  marginLeft: 0,
  flex: 1,
});

export const MobileNavBar = styled('div')<{ theme?: Theme }>((props) => ({
  alignItems: 'center',
  display: 'flex',
  borderBottom: `1px solid ${props.theme?.palette.greyLight}`,
  padding: '8px',
  position: 'relative',
}));

export const InnerMobileNavBar = styled('div')<{ theme?: Theme }>((props) => ({
  borderRadius: '4px',
  backgroundColor: props.theme?.palette.greyLight,
  color: props.theme?.palette.white,
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
  marginLeft: 24,
});

export const NavBar = styled(AppBar)<{ theme?: Theme }>(({ theme }) => ({
  backgroundColor:
    theme?.palette.mode === 'light' ? theme?.palette.primary.main : theme?.palette.cyanBlue,
  color: theme?.palette.white,
  minHeight: 60,
  display: 'flex',
  justifyContent: 'center',
  [`@media (max-width: ${theme?.breakPoints.xsmall}px)`]: css`
    ${InfoButton} {
      display: none;
    }
    ${SwitchThemeButton} {
      display: none;
    }
    ${SettingsButtom} {
      display: none;
    }
  `,
  [`@media (min-width: ${theme?.breakPoints.medium}px)`]: css`
    ${SearchWrapper} {
      display: flex;
    }
    ${IconSearchButton} {
      display: none;
    }
    ${MobileNavBar} {
      display: none;
    }
  `,
  [`@media (min-width: ${theme?.breakPoints.large}px)`]: css`
    ${InnerNavBar} {
      padding: 0 16px;
    }
  `,
  [`@media (min-width: ${theme?.breakPoints.xlarge}px)`]: css`
    ${InnerNavBar} {
      max-width: 1240px;
      width: 100%;
      margin: 0 auto;
    }
  `,
}));

export const StyledLink = styled(Link)<{ theme?: Theme }>(({ theme }) => ({
  color: theme?.palette.white,
}));
