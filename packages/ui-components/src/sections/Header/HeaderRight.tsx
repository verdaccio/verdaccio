import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import React, { MouseEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCustomTheme } from '../../';
import HeaderMenu from './HeaderMenu';
import HeaderToolTip from './HeaderToolTip';

interface Props {
  showSearch?: boolean;
  username?: string | null;
  hasLogin?: boolean;
  showInfo?: boolean;
  showSettings?: boolean;
  showThemeSwitch?: boolean;
  onToggleLogin: () => void;
  onOpenRegistryInfoDialog: () => void;
  onOpenSettingsDialog: () => void;
  onToggleMobileNav: () => void;
  onLogout: () => void;
}

const HeaderRight: React.FC<Props> = ({
  showSearch,
  username,
  onToggleLogin,
  hasLogin,
  showInfo,
  showSettings,
  showThemeSwitch,
  onLogout,
  onToggleMobileNav,
  onOpenRegistryInfoDialog,
  onOpenSettingsDialog,
}) => {
  // @ts-ignore
  const { isDarkMode, setIsDarkMode } = useCustomTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const hideLoginSection = hasLogin === false;

  const { t } = useTranslation();

  useEffect(() => {
    setIsMenuOpen(Boolean(anchorEl));
  }, [anchorEl]);

  /**
   * opens popover menu for logged in user.
   */
  const handleLoggedInMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * closes popover menu for logged in user
   */
  const handleLoggedInMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * close/open popover menu for logged in users.
   */
  const handleToggleLogin = () => {
    setAnchorEl(null);
    onToggleLogin();
  };

  const handleToggleDarkLightMode = () => {
    setTimeout(() => {
      setIsDarkMode(!isDarkMode);
    }, 300);
  };

  return (
    <Toolbar
      data-testid="header-right"
      sx={{
        display: 'flex',
        padding: 0,
        marginRight: 0,
        '@media (min-width: 600px)': {
          padding: 0,
          marginRight: 0,
        },
      }}
    >
      {showSearch === true && (
        <HeaderToolTip
          onClick={onToggleMobileNav}
          title={t('search.packages')}
          tooltipIconType={'search'}
        />
      )}

      {showSettings === true && (
        <HeaderToolTip
          onClick={onOpenSettingsDialog}
          title={t('header.settings')}
          tooltipIconType={'settings'}
        />
      )}
      {showInfo === true && (
        <HeaderToolTip
          onClick={onOpenRegistryInfoDialog}
          title={t('header.registry-info')}
          tooltipIconType={'info'}
        />
      )}
      {showThemeSwitch === true && (
        <HeaderToolTip
          onClick={handleToggleDarkLightMode}
          title={t('header.documentation')}
          tooltipIconType={isDarkMode ? 'dark-mode' : 'light-mode'}
        />
      )}

      {!hideLoginSection && (
        <>
          {username ? (
            <HeaderMenu
              anchorEl={anchorEl}
              isMenuOpen={isMenuOpen}
              onLoggedInMenu={handleLoggedInMenu}
              onLoggedInMenuClose={handleLoggedInMenuClose}
              onLogout={onLogout}
              username={username}
            />
          ) : (
            <Button color="inherit" data-testid="header--button-login" onClick={handleToggleLogin}>
              {t('button.login')}
            </Button>
          )}
        </>
      )}
    </Toolbar>
  );
};

export default HeaderRight;
