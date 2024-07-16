import styled from '@emotion/styled';
import { default as Photo } from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import { default as MuiIconButton } from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';

import { Theme } from '../../';

export const OverviewItem = styled('span')<{ theme?: Theme }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: '0 20px 0 0',
  color: theme?.palette.mode === 'light' ? theme?.palette.greyDark2 : theme?.palette.white,
  fontSize: 12,
  [`@media (max-width: ${theme?.breakPoints.medium}px)`]: {
    ':nth-of-type(3)': {
      display: 'none',
    },
  },
  [`@media (max-width: ${theme?.breakPoints.small}px)`]: {
    ':nth-of-type(4)': {
      display: 'none',
    },
  },
}));

export const Published = styled('span')({
  margin: '0 5px 0 0',
});

export const Details = styled('span')({
  marginLeft: '5px',
  lineHeight: 1.5,
  display: 'flex',
  flexDirection: 'column',
});

export const Author = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

export const Avatar = styled(Photo)({
  width: '20px',
  height: '20px',
});

export const WrapperLink = styled(Link)({
  textDecoration: 'none',
});

export const PackageTitle = styled('span')<{ theme?: Theme }>(({ theme }) => ({
  fontWeight: theme?.fontWeight.bold,
  fontSize: 20,
  display: 'block',
  marginBottom: 12,
  color: theme?.palette.mode == 'dark' ? theme?.palette.dodgerBlue : theme?.palette.eclipse,
  cursor: 'pointer',
  textDecoration: 'none',
  [`@media (max-width: ${theme?.breakPoints.small}px)`]: {
    fontSize: 14,
    marginBottom: 8,
  },
}));

export const GridRightAligned = styled(Grid)({
  textAlign: 'right',
});

export const Wrapper = styled(List)<{ theme?: Theme }>(({ theme }) => ({
  '&:hover': {
    backgroundColor:
      theme?.palette.mode === 'light' ? theme?.palette.primary.main : theme?.palette.cyanBlue,
  },
}));

export const IconButton = styled(MuiIconButton)({
  padding: 6,
  svg: {
    fontSize: 16,
  },
});

export const PackageListItemText = styled(ListItemText)({
  paddingRight: 0,
});

export const Description = styled('span')<{ theme?: Theme }>(({ theme }) => ({
  color: theme?.palette.mode === 'light' ? theme?.palette.greyDark2 : theme?.palette.white,
  fontSize: '14px',
  paddingRight: 0,
}));
