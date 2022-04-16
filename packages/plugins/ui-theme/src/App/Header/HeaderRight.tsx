import Button from '@mui/material/Button';
import React, { MouseEvent, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ThemeContext from 'verdaccio-ui/design-tokens/ThemeContext';

import HeaderMenu from './HeaderMenu';
import HeaderToolTip from './HeaderToolTip';
import { RightSide } from './styles';

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
  const themeContext = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const hideLoginSection = hasLogin === false;

  const { t } = useTranslation();

  if (!themeContext) {
    throw Error(t('theme-context-not-correct-used'));
  }

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
      themeContext.setIsDarkMode(!themeContext.isDarkMode);
    }, 300);
  };

  return (
    <RightSide data-testid="header-right">
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
          tooltipIconType={themeContext.isDarkMode ? 'dark-mode' : 'light-mode'}
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
    </RightSide>
  );
};

export default HeaderRight;
