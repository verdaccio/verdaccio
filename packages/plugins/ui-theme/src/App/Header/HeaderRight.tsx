import React, { useState, useEffect, useContext, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import Button from 'verdaccio-ui/components/Button';
import ThemeContext from 'verdaccio-ui/design-tokens/ThemeContext';

import HeaderMenu from './HeaderMenu';
import HeaderToolTip from './HeaderToolTip';
import LanguageSwitch from './LanguageSwitch';
import { RightSide } from './styles';

interface Props {
  withoutSearch?: boolean;
  username?: string;
  onToggleLogin: () => void;
  onOpenRegistryInfoDialog: () => void;
  onToggleMobileNav: () => void;
  onLogout: () => void;
}

const HeaderRight: React.FC<Props> = ({
  withoutSearch = false,
  username,
  onToggleLogin,
  onLogout,
  onToggleMobileNav,
  onOpenRegistryInfoDialog,
}) => {
  const themeContext = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

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
      {!withoutSearch && (
        <HeaderToolTip
          onClick={onToggleMobileNav}
          title={t('search.packages')}
          tooltipIconType={'search'}
        />
      )}
      <LanguageSwitch />
      <HeaderToolTip title={t('header.documentation')} tooltipIconType={'help'} />
      <HeaderToolTip
        onClick={onOpenRegistryInfoDialog}
        title={t('header.registry-info')}
        tooltipIconType={'info'}
      />
      <HeaderToolTip
        onClick={handleToggleDarkLightMode}
        title={t('header.documentation')}
        tooltipIconType={themeContext.isDarkMode ? 'dark-mode' : 'light-mode'}
      />

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
    </RightSide>
  );
};

export default HeaderRight;
