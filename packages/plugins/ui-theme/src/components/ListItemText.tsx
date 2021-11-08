import { ListItemTextProps, default as MaterialUIListItemText } from '@mui/material/ListItemText';
import React, { forwardRef } from 'react';

type ListItemTextRef = HTMLDivElement;

const ListItemText = forwardRef<ListItemTextRef, ListItemTextProps>(function ListItemText(
  props,
  ref
) {
  return <MaterialUIListItemText {...props} ref={ref} />;
});

export default ListItemText;
