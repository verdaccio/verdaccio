/**
 * @prettier
 * @flow
 */

import styled, {css} from 'react-emotion';
import AppBar from '@material-ui/core/AppBar/index';
import Toolbar from '@material-ui/core/Toolbar/index';
import colors from '../../utils/styles/colors';
import mq from '../../utils/styles/media';

export const Wrapper = styled(AppBar)`
  && {
    background-color: ${colors.primary};
    position: fixed;
  }
`;

export const InnerWrapper = styled(Toolbar)`
  && {
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    ${mq.medium(css`
      min-width: 400px;
      max-width: 800px;
      width: 100%;
      margin: auto;
    `)};
    ${mq.large(css`
      max-width: 1240px;
    `)};
  }
`;
