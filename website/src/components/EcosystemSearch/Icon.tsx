import AltRouteIcon from '@mui/icons-material/AltRoute';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import HandymanIcon from '@mui/icons-material/Handyman';
import HubIcon from '@mui/icons-material/Hub';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import * as React from 'react';
import { FC } from 'react';

const Icon: FC<{ category: string }> = ({ category }): React.ReactElement => {
  if (category === 'middleware') {
    return <AltRouteIcon titleAccess={'Middleware Plugin'} />;
  } else if (category === 'storage') {
    return <StorageIcon titleAccess={'Storage Plugin'} />;
  } else if (category === 'tool') {
    return <HandymanIcon titleAccess={'Tool'} />;
  } else if (category === 'filter') {
    return <FilterAltIcon titleAccess={'Filter Plugin'} />;
  } else if (category === 'authentication') {
    return <SecurityIcon titleAccess={'Authentication Plugin'} />;
  } else if (category === 'ui') {
    return <ColorLensIcon titleAccess={'UI Theme'} />;
  }

  return <HubIcon />;
};

export default Icon;
