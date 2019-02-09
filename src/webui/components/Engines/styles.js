/**
 * @prettier
 * @flow
 */

import styled from 'react-emotion';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem/index';
import Typography from '@material-ui/core/Typography/index';

import colors from '../../utils/styles/colors';

export const Heading = styled(Typography)`
  && {
    font-weight: 700;
    text-transform: capitalize;
  }
`;

export const EngineListItem = styled(ListItem)`
  && {
    padding-left: 0;
  }
`;

export const EngineAvatar = styled(Avatar)`
  && {
    color: ${colors.greySuperLight};
    background-color: ${colors.primary};
  }
`;
