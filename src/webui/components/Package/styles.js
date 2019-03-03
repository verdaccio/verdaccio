/**
 * @prettier
 * @flow
 */

import styled from 'react-emotion';
import { Link } from 'react-router-dom';

import Grid from '@material-ui/core/Grid/index';
import List from '@material-ui/core/List/index';
import ListItem from '@material-ui/core/ListItem/index';
import ListItemText from '@material-ui/core/ListItemText/index';
import MuiIconButton from '@material-ui/core/IconButton/index';
import Photo from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography/index';

import { breakpoints } from '../../utils/styles/media';
import Ico from '../Icon';
import Label from '../Label';
import colors from '../../utils/styles/colors';

export const OverviewItem = styled.span`
  && {
    display: flex;
    align-items: center;
    margin: 0 0 0 16px;
    color: ${colors.greyLight2};
    font-size: 12px;
    @media (max-width: ${breakpoints.medium}px) {
      &:nth-child(3) {
        display: none;
      }
    }
    @media (max-width: ${breakpoints.small}px) {
      &:nth-child(4) {
        display: none;
      }
    }
  }
`;

export const Icon = styled(Ico)`
  && {
    margin: 2px 10px 0px 0;
    fill: ${colors.greyLight2};
  }
`;

export const Published = styled.span`
  && {
    color: ${colors.greyLight2};
    margin: 0px 5px 0px 0px;
  }
`;

export const Text = styled(Label)`
  && {
    font-size: 12px;
    font-weight: 500;
    color: ${colors.greyLight2};
  }
`;

export const Details = styled.span`
  && {
    margin-left: 5px;
    line-height: 1.5;
    display: flex;
    flex-direction: column;
  }
`;

export const Author = styled.div`
  && {
    display: flex;
    align-items: center;
  }
`;

export const Avatar = styled(Photo)`
  && {
    width: 20px;
    height: 20px;
  }
`;

export const WrapperLink = styled(Link)`
  && {
    text-decoration: none;
  }
`;

export const PackageTitle = styled.span`
  && {
    font-weight: 600;
    font-size: 20px;
    display: block;
    margin-bottom: 12px;
    color: ${colors.eclipse};
    cursor: pointer;

    &:hover {
      color: ${colors.black};
    }

    @media (max-width: ${breakpoints.small}px) {
      font-size: 14px;
      margin-bottom: 8px;
    }
  }
`;

export const GridRightAligned = styled(Grid)`
  && {
    text-align: right;
  }
`;

export const PackageList = styled(List)`
  && {
    padding: 12px 0 12px 0;

    &:hover {
      background-color: ${colors.greyLight3};
    }
  }
`;

export const IconButton = styled(MuiIconButton)`
  && {
    padding: 6px;

    svg {
      font-size: 16px;
    }
  }
`;

export const TagContainer = styled.span`
  && {
    margin-top: 8px;
    margin-bottom: 12px;
    display: block;
    @media (max-width: ${breakpoints.medium}px) {
      display: none;
    }
  }
`;

export const PackageListItem = styled(ListItem)`
  && {
    padding-top: 0;
  }
`;

export const PackageListItemText = styled(ListItemText)`
  && {
    padding-right: 0;
  }
`;

export const Description = styled(Typography)`
  color: ${colors.greyDark2};
  font-size: 14px;
  padding-right: 0;
`;
