import styled from '@emotion/styled';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { common } from '@mui/material/colors';

import { Theme } from '../../';

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
      borderColor: common.white,
    },
    ':hover:before': {
      content: 'none',
    },
    ':hover:after': {
      content: 'none',
      transform: 'scaleX(1)',
    },
    [`@media screen and (min-width: ${props.theme.breakPoints.medium}px)`]: {
      ':hover:after': {
        content: "''",
      },
    },
  },
  '& .MuiInputBase-input': {
    [`@media screen and (min-width: ${props.theme.breakPoints.medium}px)`]: {
      color: common.white,
    },
  },
}));

export const StyledInputAdornment = styled(InputAdornment)<{ theme?: Theme }>(() => ({
  color: common.white,
}));
