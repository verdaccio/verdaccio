import styled from '@emotion/styled';
import InputAdornment from '@mui/material/InputAdornment';

import { TextField, Theme } from '../../';

export interface InputFieldProps {
  color: string;
}

export const StyledTextField = styled(TextField)<{ theme?: Theme }>((props) => ({
  '& .MuiInputBase-root': {
    ':before': {
      content: "''",
      border: 'none',
    },
    ':after': {
      borderColor:
        props.theme?.palette.mode === 'light'
          ? props.theme?.palette.black
          : props.theme?.palette.white,
    },
    ':hover:before': {
      content: 'none',
    },
    ':hover:after': {
      content: 'none',
      transform: 'scaleX(1)',
    },
    [`@media screen and (min-width: ${props.theme?.breakPoints.medium}px)`]: {
      ':hover:after': {
        content: "''",
      },
    },
  },
  '& .MuiInputBase-input': {
    [`@media screen and (min-width: ${props.theme?.breakPoints.medium}px)`]: {
      color:
        props.theme?.palette.mode === 'light'
          ? props.theme?.palette.black
          : props.theme?.palette.white,
    },
  },
}));

export const StyledInputAdornment = styled(InputAdornment)<{ theme?: Theme }>((props) => ({
  color:
    props.theme?.palette.mode === 'light' ? props.theme?.palette.black : props.theme?.palette.white,
}));
