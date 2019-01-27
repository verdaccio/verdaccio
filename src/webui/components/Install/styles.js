/**
 * @prettier
 * @flow
 */

import styled from 'react-emotion';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';

export const Heading = styled(Typography)`
  && {
    font-weight: 700;
    text-transform: capitalize;
  }
`;

export const InstallItem = styled(ListItem)`
  && {
    padding-top: 0px;
    padding-bottom: 0px;
  }
`;

export const PackageMangerAvatar = styled(Avatar)`
  && {
    border-radius: 0px;
  }
`;
