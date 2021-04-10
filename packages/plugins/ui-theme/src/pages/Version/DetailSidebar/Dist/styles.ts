import styled from '@emotion/styled';

import Chip from 'verdaccio-ui/components/Chip';
import FloatingActionButton from 'verdaccio-ui/components/FloatingActionButton';
import ListItem from 'verdaccio-ui/components/ListItem';
import Text from 'verdaccio-ui/components/Text';
import { Theme } from 'verdaccio-ui/design-tokens/theme';

export const StyledText = styled(Text)<{ theme?: Theme }>((props) => ({
  fontWeight: props.theme && props.theme.fontWeight.bold,
  textTransform: 'capitalize',
}));

export const DistListItem = styled(ListItem)({
  paddingLeft: 0,
  paddingRight: 0,
});

export const DistChips = styled(Chip)({
  marginRight: 5,
  textTransform: 'capitalize',
});

export const DownloadButton = styled(FloatingActionButton)<{ theme?: Theme }>((props) => ({
  backgroundColor: props.theme && props.theme.palette.primary.main,
  color: props.theme && props.theme.palette.white,
}));
