import { TypographyProps } from '@mui/material/Typography';

type TextType = 'subtitle1' | 'subtitle2' | 'body1' | 'body2';

export interface TextProps extends Omit<TypographyProps, 'variant'> {
  variant?: TextType;
}
