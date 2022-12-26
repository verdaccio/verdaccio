import styled from '@emotion/styled';
import FabMUI from '@mui/material/Fab';
import Typography from '@mui/material/Typography';

import { Theme } from '../../Theme';

export const Details = styled('span')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const Content = styled('div')({
  margin: '10px 0 10px 0',
  display: 'flex',
  flexWrap: 'wrap',
  '> *': {
    margin: '5px',
  },
});

export const StyledText = styled(Typography)<{ theme?: Theme }>((props) => ({
  fontWeight: props.theme?.fontWeight.bold,
  marginBottom: '10px',
  textTransform: 'capitalize',
}));

export const Fab = styled(FabMUI)<{ theme?: Theme }>((props) => ({
  backgroundColor: props.theme?.palette.primary.main,
  color: props.theme?.palette.white,
}));
