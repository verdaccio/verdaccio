import Check from '@mui/icons-material/Check';
import Settings from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useSettings } from '../../providers/PersistenceSettingProvider';

interface Props {
  packageName: string;
}

const InstallListItem: React.FC<Props> = ({ packageName }) => {
  const { t } = useTranslation();
  const { localSettings, updateSettings } = useSettings();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleGlobalSelect = () => {
    const statusGlobal = !localSettings[packageName]?.global;
    updateSettings({ ...localSettings, [packageName]: { global: statusGlobal } });
    setAnchorEl(null);
  };

  const handleGlobalYarnModern = () => {
    const statusYarnModern = !localSettings?.yarnModern;
    updateSettings({ ...localSettings, yarnModern: statusYarnModern });
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const statusGlobal = localSettings[packageName]?.global;
  return (
    <>
      <IconButton
        aria-controls={open ? 'basic-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        id="basic-button"
        onClick={handleOpenMenu}
        size="small"
      >
        <Settings fontSize="small" />
      </IconButton>
      <Menu
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorEl={anchorEl}
        id="basic-menu"
        onClose={handleClose}
        open={open}
      >
        <MenuItem onClick={handleGlobalSelect}>
          {' '}
          {statusGlobal === true ? (
            <ListItemIcon>
              <Check />
            </ListItemIcon>
          ) : null}
          {t('sidebar.installation.global')}
        </MenuItem>
        <MenuItem onClick={handleGlobalYarnModern}>
          {' '}
          {localSettings?.yarnModern ? (
            <ListItemIcon>
              <Check />
            </ListItemIcon>
          ) : null}
          {t('sidebar.installation.yarnModern')}
        </MenuItem>
      </Menu>
    </>
  );
};

export default InstallListItem;
