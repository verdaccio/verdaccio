import Button from '@mui/material/Button';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Dispatch, LoginDialog, RootState, Search, useConfig } from '../../';
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

// Session timeout default is 1 hour
const Header: React.FC<Props> = ({
  HeaderInfoDialog,
  isPlainHeader,
  tokenCheckIntervalMs = 60 * 60 * 1000,
}) => {
  const { t } = useTranslation();
  const [isInfoDialogOpen, setOpenInfoDialog] = useState<boolean>(false);
  const [isSettingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);
  const [showMobileNavBar, setShowMobileNavBar] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const loginStore = useSelector((state: RootState) => state.login);
  const { configOptions } = useConfig();
  const dispatch = useDispatch<Dispatch>();

  // Use a ref to always have the latest token in the interval callback
  const tokenRef = useRef(loginStore.token);
  useEffect(() => {
    tokenRef.current = loginStore.token;
  }, [loginStore.token]);

  useEffect(() => {
    function checkToken() {
      const token = tokenRef.current;
      if (token && isTokenExpire(token)) {
        dispatch.login.logOutUser();
      }
    }
    checkToken();
    const interval = setInterval(checkToken, tokenCheckIntervalMs);
    return () => clearInterval(interval);
  }, [dispatch, tokenCheckIntervalMs]);

  const handleLogout = () => {
    dispatch.login.logOutUser();
    setShowLoginModal(false);
  };
  if (isPlainHeader) {
    // Header with logo and nothing else
    return (
      <NavBar data-testid="header" position="static">
        <InnerNavBar>
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
        <InnerNavBar>
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
            username={loginStore?.username}
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
        <MobileNavBar>
          <InnerMobileNavBar>
            <Search />
          </InnerMobileNavBar>
          <Button color="inherit" onClick={() => setShowMobileNavBar(false)}>
            {t('button.cancel')}
          </Button>
        </MobileNavBar>
      )}
      {!loginStore.username && (
        <LoginDialog onClose={() => setShowLoginModal(false)} open={showLoginModal} />
      )}
    </>
  );
};

export default Header;
