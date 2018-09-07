/**
 * @prettier
 */

/* @flow */

import styled, {css} from 'react-emotion';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
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

export const ClipBoardCopy = styled.p`
  && {
    padding: 5px 0 0 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const ClipBoardCopyText = styled.span`
  && {
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    height: 21px;
  }
`;

export const CopyIcon = styled(IconButton)`
  && {
    margin: 0 0 0 10px;
  }
`;
