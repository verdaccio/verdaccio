/**
 * @prettier
 * @flow
 */

import styled from 'react-emotion';
import Avatar from '@material-ui/core/Avatar/index';
import ListItem from '@material-ui/core/ListItem/index';

import colors from '../../utils/styles/colors';

export const TitleListItem = styled(ListItem)`
  && {
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 0;
  }
`;

export const TitleAvatar = styled(Avatar)`
  && {
    color: ${colors.greySuperLight};
    background-color: ${colors.primary};
    text-transform: capitalize;
  }
`;
