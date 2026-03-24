import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import type { MouseEvent } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { MenuItem } from '../../';
import HeaderGreetings from './HeaderGreetings';

// Workaround: MUI v7 MenuProps type resolution breaks inherited PopoverProps.
const TypedMenu = Menu as React.FC<any>;

interface Props {
  username: string;
  isMenuOpen: boolean;
  anchorEl?: Element | null | undefined;
  onLogout: () => void;
  onLoggedInMenu: (event: MouseEvent<HTMLButtonElement>) => void;
  onLoggedInMenuClose: () => void;
}

const HeaderMenu: React.FC<Props> = ({
  onLogout,
  username,
  isMenuOpen = false,
  anchorEl,
  onLoggedInMenu,
  onLoggedInMenuClose,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <IconButton
        color="inherit"
        data-testid="logInDialogIcon"
        id="header--button-account"
        onClick={onLoggedInMenu}
        size="large"
      >
        <AccountCircle />
      </IconButton>
      <TypedMenu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        onClose={onLoggedInMenuClose}
        open={isMenuOpen}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem>
          <HeaderGreetings username={username} />
        </MenuItem>
        <MenuItem data-testid="logOutDialogIcon" id="logOutDialogIcon" onClick={onLogout}>
          {t('button.logout')}
        </MenuItem>
      </TypedMenu>
    </>
  );
};

export default HeaderMenu;
