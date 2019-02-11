/**
 * @prettier
 * @flow
 */

import styled from 'react-emotion';
import Fab from '@material-ui/core/Fab/index';
import Chip from '@material-ui/core/Chip/index';
import ListItem from '@material-ui/core/ListItem/index';
import Typography from '@material-ui/core/Typography/index';

import colors from '../../utils/styles/colors';

export const Heading = styled(Typography)`
  && {
    font-weight: 700;
    text-transform: capitalize;
  }
`;

export const DistListItem = styled(ListItem)`
  && {
    padding-left: 0;
    padding-right: 0;
  }
`;

export const DistChips = styled(Chip)`
  && {
    margin-right: 5px;
    text-transform: capitalize;
  }
`;

export const DownloadButton = styled(Fab)`
  && {
    background-color: ${colors.primary};
    color: ${colors.white};
  }
`;
