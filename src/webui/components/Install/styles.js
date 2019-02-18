/**
 * @prettier
 * @flow
 */

import styled from 'react-emotion';
import Typography from '@material-ui/core/Typography/index';
import ListItem from '@material-ui/core/ListItem/index';
import Avatar from '@material-ui/core/Avatar/index';

export const Heading = styled(Typography)`
  && {
    font-weight: 700;
    text-transform: capitalize;
  }
`;

export const InstallItem = styled(ListItem)`
  && {
    padding: 0 0 0 0;
  }
`;

export const PackageMangerAvatar = styled(Avatar)`
  && {
    border-radius: 0px;
  }
`;
