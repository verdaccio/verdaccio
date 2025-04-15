import Button from '@mui/material/Button';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Dispatch, LoginDialog, RootState, Search, useConfig } from '../../';
import HeaderLeft from './HeaderLeft';
import HeaderRight from './HeaderRight';
import HeaderSettingsDialog from './HeaderSettingsDialog';
import { InnerMobileNavBar, InnerNavBar, MobileNavBar, NavBar } from './styles';

type Props = {
  // TODO: set correct type here
  HeaderInfoDialog?: any;
  isPlainHeader?: boolean;
};

/* eslint-disable react/jsx-no-bind*/
const Header: React.FC<Props> = ({ HeaderInfoDialog, isPlainHeader }) => {
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
