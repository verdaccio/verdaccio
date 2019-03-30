/**
 * @prettier
 * @flow
 */

import styled from 'react-emotion';
import Grid from '@material-ui/core/Grid/index';
import ListItem from '@material-ui/core/ListItem/index';
import Typography from '@material-ui/core/Typography/index';

import Github from '../../icons/GitHub';
import colors from '../../utils/styles/colors';

export const Heading = styled(Typography)`
  && {
    font-weight: 700;
    text-transform: capitalize;
  }
`;

export const GridRepo = styled(Grid)`
  && {
    align-items: center;
  }
`;

export const GithubLink = styled('a')`
  && {
    color: ${colors.primary};
  }
`;

export const GithubLogo = styled(Github)`
  && {
    font-size: 40px;
    color: ${colors.primary};
    background-color: ${colors.greySuperLight};
  }
`;

export const RepositoryListItem = styled(ListItem)`
  && {
    padding-left: 0;
    padding-right: 0;
  }
`;
