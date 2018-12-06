/**
 * @prettier
 * @flow
 */

import styled, { css } from 'react-emotion';
import AppBar from '@material-ui/core/AppBar/index';
import Toolbar from '@material-ui/core/Toolbar/index';
import IconButton from '@material-ui/core/IconButton/index';

import colors from '../../utils/styles/colors';
import mq from '../../utils/styles/media';

export const NavBar = styled(AppBar)`
  && {
    background-color: ${colors.primary};
    min-height: 60px;
    display: flex;
    justify-content: center;
  }
`;

export const InnerNavBar = styled(Toolbar)`
  && {
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    ${mq.large(css`
      padding: 0 20px;
    `)};
    ${mq.xlarge(css`
      max-width: 1240px;
      width: 100%;
      margin: 0 auto;
    `)};
  }
`;

export const Greetings = styled.span`
  && {
    margin: 0 5px 0 0;
  }
`;

export const RightSide = styled(Toolbar)`
  && {
    display: flex;
    padding: 0;
  }
`;

export const LeftSide = styled(RightSide)`
  && {
    flex: 1;
  }
`;

export const MobileNavBar = styled.div`
  && {
    align-items: center;
    display: flex;
    border-bottom: 1px solid ${colors.greyLight};
    padding: 8px;
    position: relative;
    ${mq.medium(css`
      display: none;
    `)};
  }
`;

export const InnerMobileNavBar = styled.div`
  && {
    border-radius: 4px;
    background-color: ${colors.greyLight};
    color: ${colors.white};
    width: 100%;
    padding: 0px 5px;
    margin: 0 10px 0 0;
  }
`;

export const IconSearchButton = styled(IconButton)`
  && {
    display: block;
    ${mq.medium(css`
      display: none;
    `)};
  }
`;

export const SearchWrapper = styled.div`
  && {
    display: none;
    max-width: 393px;
    width: 100%;
    display: none;
    ${mq.medium(css`
      display: flex;
    `)};
  }
`;
