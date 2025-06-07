import { Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SecurityContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100%',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}));

export const SecurityForm = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 420,
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

export const SecurityTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));
