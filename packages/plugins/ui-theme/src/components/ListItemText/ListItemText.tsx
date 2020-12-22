import {
  default as MaterialUIListItemText,
  ListItemTextProps,
} from '@material-ui/core/ListItemText';
import React, { forwardRef } from 'react';

type ListItemTextRef = HTMLDivElement;

const ListItemText = forwardRef<ListItemTextRef, ListItemTextProps>(function ListItemText(
  props,
  ref
) {
  return <MaterialUIListItemText {...props} ref={ref} />;
});

export default ListItemText;
