import Button from '@mui/material/Button';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useConfig } from 'verdaccio-ui/providers/config';

import { Dispatch, RootState } from '../../store/store';
import HeaderInfoDialog from './HeaderInfoDialog';
import HeaderLeft from './HeaderLeft';
import HeaderRight from './HeaderRight';
import HeaderSettingsDialog from './HeaderSettingsDialog';
import LoginDialog from './LoginDialog';
import Search from './Search';
import { InnerMobileNavBar, InnerNavBar, MobileNavBar, NavBar } from './styles';

/* eslint-disable react/jsx-no-bind*/
const Header: React.FC = () => {
  const { t } = useTranslation();
  const [isInfoDialogOpen, setOpenInfoDialog] = useState<boolean>(false);
  const [isSettingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);
  const [showMobileNavBar, setShowMobileNavBar] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const loginStore = useSelector((state: RootState) => state.login);
  const { configOptions } = useConfig();
  const dispatch = useDispatch<Dispatch>();
  const handleLogout = () => {
    dispatch.login.logOutUser();
  };
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
        <HeaderInfoDialog
          isOpen={isInfoDialogOpen}
          onCloseDialog={() => setOpenInfoDialog(false)}
        />
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
