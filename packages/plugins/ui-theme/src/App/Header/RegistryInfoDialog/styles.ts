import styled from '@emotion/styled';

import DialogContent from 'verdaccio-ui/components/DialogContent';
import DialogTitle from 'verdaccio-ui/components/DialogTitle';
import { Theme } from 'verdaccio-ui/design-tokens/theme';

export const Title = styled(DialogTitle)<{ theme?: Theme }>((props) => ({
  backgroundColor: props.theme && props.theme.palette.primary.main,
  color: props.theme && props.theme.palette.white,
  fontSize: props.theme && props.theme.fontSize.lg,
}));

export const Content = styled(DialogContent)<{ theme?: Theme }>(({ theme }) => ({
  padding: '0 24px',
  backgroundColor: theme?.palette.background.default,
}));
