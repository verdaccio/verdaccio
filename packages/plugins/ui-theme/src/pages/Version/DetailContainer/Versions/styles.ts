import styled from '@emotion/styled';

import Link from 'verdaccio-ui/components/Link';
import { default as MuiListItemText } from 'verdaccio-ui/components/ListItemText';
import Text from 'verdaccio-ui/components/Text';
import { Theme } from 'verdaccio-ui/design-tokens/theme';

export const StyledText = styled(Text)<{ theme?: Theme }>((props) => ({
  fontWeight: props.theme && props.theme.fontWeight.bold,
}));

export const Spacer = styled('div')<{ theme?: Theme }>(({ theme }) => ({
  flex: '1 1 auto',
  borderBottom: `1px dotted ${
    theme?.palette.type == 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'
  } `,
  whiteSpace: 'nowrap',
  height: '0.5em',
  margin: '0 16px',
}));

export const ListItemText = styled(MuiListItemText)<{ theme?: Theme }>(({ theme }) => ({
  flex: 'none',
  opacity: 0.6,
  color: theme?.palette.type == 'light' ? theme?.palette.black : theme?.palette.white,
}));

export const StyledLink = styled(Link)({
  textDecoration: 'none',
});
