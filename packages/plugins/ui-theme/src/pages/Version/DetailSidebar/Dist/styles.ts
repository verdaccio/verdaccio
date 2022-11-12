import styled from '@emotion/styled';
import Chip from '@mui/material/Chip';
import FabMUI from '@mui/material/Fab';
import ListItem from '@mui/material/ListItem';
import Text from 'verdaccio-ui/components/Text';
import { Theme } from 'verdaccio-ui/design-tokens/theme';

export const StyledText = styled(Text)<{ theme?: Theme }>((props) => ({
  fontWeight: props.theme && props.theme.fontWeight.bold,
  textTransform: 'capitalize',
}));

export const DistListItem = styled(ListItem)({
  paddingLeft: 0,
  paddingRight: 0,
  flexWrap: 'wrap',
});

export const DistChips = styled(Chip)({
  marginRight: 5,
  textTransform: 'capitalize',
  marginTop: 5,
});

export const DownloadButton = styled(FabMUI)<{ theme?: Theme }>((props) => ({
  backgroundColor: props.theme && props.theme.palette.primary.main,
  color: props.theme && props.theme.palette.white,
}));
