import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Button from 'verdaccio-ui/components/Button';
import { useConfig } from 'verdaccio-ui/providers/config';

import { Dispatch, RootState } from '../../store/store';

import HeaderInfoDialog from './HeaderInfoDialog';
import HeaderLeft from './HeaderLeft';
import HeaderRight from './HeaderRight';
import LoginDialog from './LoginDialog';
import Search from './Search';
import { NavBar, InnerNavBar, MobileNavBar, InnerMobileNavBar } from './styles';

interface Props {
  withoutSearch?: boolean;
}

/* eslint-disable react/jsx-no-bind*/
const Header: React.FC<Props> = ({ withoutSearch }) => {
  const { t } = useTranslation();
  const [isInfoDialogOpen, setOpenInfoDialog] = useState<boolean>(false);
  const [showMobileNavBar, setShowMobileNavBar] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const loginStore = useSelector((state: RootState) => state.login);
  const configStore = useSelector((state: RootState) => state.configuration);
  const { configOptions } = useConfig();
  const dispatch = useDispatch<Dispatch>();
  const handleLogout = () => {
    dispatch.login.logOutUser();
  };

  return (
    <>
      <NavBar data-testid="header" position="static">
        <InnerNavBar>
          <HeaderLeft />
          <HeaderRight
            hasLogin={configOptions?.login}
            onLogout={handleLogout}
            onOpenRegistryInfoDialog={() => setOpenInfoDialog(true)}
            onToggleLogin={() => setShowLoginModal(!showLoginModal)}
            onToggleMobileNav={() => setShowMobileNavBar(!showMobileNavBar)}
            username={loginStore?.username}
            withoutSearch={withoutSearch}
          />
        </InnerNavBar>
        <HeaderInfoDialog
          isOpen={isInfoDialogOpen}
          onCloseDialog={() => setOpenInfoDialog(false)}
          registryUrl={configOptions.base}
          scope={configStore.scope}
        />
      </NavBar>
      {showMobileNavBar && !withoutSearch && (
        <MobileNavBar>
          <InnerMobileNavBar>
            <Search />
          </InnerMobileNavBar>
          <Button color="inherit" onClick={() => setShowMobileNavBar(false)}>
            {t('button.cancel')}
          </Button>
        </MobileNavBar>
      )}
      {!loginStore.user && (
        <LoginDialog onClose={() => setShowLoginModal(false)} open={showLoginModal} />
      )}
    </>
  );
};

export default Header;
