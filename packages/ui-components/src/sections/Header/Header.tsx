import Button from '@mui/material/Button';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LoginDialog, Search, useAuth, useConfig } from '../../';
import { tokenExpireInMs } from '../../utils/token';
import HeaderLeft from './HeaderLeft';
import HeaderRight from './HeaderRight';
import HeaderSettingsDialog from './HeaderSettingsDialog';
import { InnerMobileNavBar, InnerNavBar, MobileNavBar, NavBar } from './styles';

type Props = {
  HeaderInfoDialog?: React.FC<any>;
  isPlainHeader?: boolean;
};

const Header: React.FC<Props> = ({ HeaderInfoDialog, isPlainHeader }) => {
  const { t } = useTranslation();
  const [isInfoDialogOpen, setOpenInfoDialog] = useState<boolean>(false);
  const [isSettingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);
  const [showMobileNavBar, setShowMobileNavBar] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const { configOptions } = useConfig();
  const { userState, logOutUser } = useAuth();

  // Use a ref to always have the latest logout in the timer callback
  const logOutUserRef = useRef(logOutUser);
  useEffect(() => {
    logOutUserRef.current = logOutUser;
  }, [logOutUser]);

  // log out exactly when the token expires; polling reloaded the page at an
  // arbitrary moment up to a minute later, mid-interaction
  useEffect(() => {
    const token = userState?.token;
    if (!token) {
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const arm = () => {
      const remaining = tokenExpireInMs(token);
      if (remaining === null || remaining <= 0) {
        logOutUserRef.current?.();
        return;
      }
      // setTimeout overflows above 2^31-1 ms; re-arm for far-away expiries
      timer = setTimeout(arm, Math.min(remaining, 2 ** 31 - 1));
    };
    arm();
    return () => clearTimeout(timer);
  }, [userState?.token]);

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
