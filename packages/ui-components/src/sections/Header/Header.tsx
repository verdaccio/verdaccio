import Button from '@mui/material/Button';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LoginDialog, Search, useAuth, useConfig } from '../../';
import { isTokenExpire } from '../../utils/token';
import HeaderLeft from './HeaderLeft';
import HeaderRight from './HeaderRight';
import HeaderSettingsDialog from './HeaderSettingsDialog';
import { InnerMobileNavBar, InnerNavBar, MobileNavBar, NavBar } from './styles';

type Props = {
  HeaderInfoDialog?: React.FC<any>;
  isPlainHeader?: boolean;
  tokenCheckIntervalMs?: number;
};

// checking the token is a local decode, so a short interval is cheap; the old
// hourly default kept showing the user as logged in for up to an hour after
// the session expired
const Header: React.FC<Props> = ({
  HeaderInfoDialog,
  isPlainHeader,
  tokenCheckIntervalMs = 60 * 1000,
}) => {
  const { t } = useTranslation();
  const [isInfoDialogOpen, setOpenInfoDialog] = useState<boolean>(false);
  const [isSettingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);
  const [showMobileNavBar, setShowMobileNavBar] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const { configOptions } = useConfig();
  const { userState, logOutUser } = useAuth();

  // Use refs to always have the latest token/logout in the interval callback
  const tokenRef = useRef(userState?.token);
  const logOutUserRef = useRef(logOutUser);
  useEffect(() => {
    tokenRef.current = userState?.token;
  }, [userState?.token]);
  useEffect(() => {
    logOutUserRef.current = logOutUser;
  }, [logOutUser]);

  useEffect(() => {
    function checkToken() {
      const token = tokenRef.current;
      if (token && isTokenExpire(token)) {
        logOutUserRef.current?.();
      }
    }
    checkToken();
    const interval = setInterval(checkToken, tokenCheckIntervalMs);
    return () => clearInterval(interval);
  }, [tokenCheckIntervalMs]);

  const handleLogout = () => {
    logOutUser?.();
    setShowLoginModal(false);
  };
  if (isPlainHeader) {
    return (
      <NavBar data-testid="header" position="static">
        <InnerNavBar data-testid="inner-nav-bar">
          <HeaderLeft showSearch={false} />
          <HeaderRight
            hasLogin={false}
            onLogout={() => {}}
            onOpenRegistryInfoDialog={() => {}}
            onOpenSettingsDialog={() => {}}
            onToggleLogin={() => {}}
            onToggleMobileNav={() => {}}
            showInfo={false}
            showSearch={false}
            showSettings={false}
            showThemeSwitch={false}
            username={''}
          />
        </InnerNavBar>
      </NavBar>
    );
  }

  return (
    <>
      <NavBar data-testid="header" position="static">
        <InnerNavBar data-testid="inner-nav-bar">
          <HeaderLeft showSearch={configOptions.showSearch} />
          <HeaderRight
            hasLogin={configOptions?.login}
            onLogout={handleLogout}
            onOpenRegistryInfoDialog={() => setOpenInfoDialog(true)}
            onOpenSettingsDialog={() => setSettingsDialogOpen(true)}
            onToggleLogin={() => setShowLoginModal(!showLoginModal)}
            onToggleMobileNav={() => setShowMobileNavBar(!showMobileNavBar)}
            showInfo={configOptions.showInfo}
            showSearch={configOptions.showSearch}
            showSettings={configOptions.showSettings}
            showThemeSwitch={configOptions.showThemeSwitch}
            username={userState?.username}
          />
        </InnerNavBar>
        <HeaderSettingsDialog
          isOpen={isSettingsDialogOpen}
          onCloseDialog={() => setSettingsDialogOpen(false)}
        />
        {HeaderInfoDialog ? (
          <HeaderInfoDialog
            dialogTitle={t('dialog.registry-info.title')}
            isOpen={isInfoDialogOpen}
            onCloseDialog={() => setOpenInfoDialog(false)}
          />
        ) : null}
      </NavBar>
      {showMobileNavBar && (
        <MobileNavBar data-testid="mobile-nav-bar">
          <InnerMobileNavBar>
            <Search />
          </InnerMobileNavBar>
          <Button color="inherit" onClick={() => setShowMobileNavBar(false)}>
            {t('button.cancel')}
          </Button>
        </MobileNavBar>
      )}
      {!userState?.username && (
        <LoginDialog onClose={() => setShowLoginModal(false)} open={showLoginModal} />
      )}
    </>
  );
};

export default Header;
