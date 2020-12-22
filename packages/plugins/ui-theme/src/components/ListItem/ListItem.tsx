import { default as MaterialUIListItem, ListItemProps } from '@material-ui/core/ListItem';
import React, { forwardRef } from 'react';

type ListItemRef<T extends boolean = false> = T extends true ? HTMLDivElement : HTMLLIElement;

interface Props<T extends boolean = false> extends Omit<ListItemProps, 'button'> {
  button?: T;
}

const ListItem = forwardRef(function ListItem<T extends boolean>(
  { button, ...props }: Props<T>,
  ref: React.Ref<ListItemRef<T>>
) {
  // it seems typescript has some discrimination type limitions. Please see: https://github.com/mui-org/material-ui/issues/14971
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <MaterialUIListItem {...props} button={button as any} innerRef={ref} />;
});

ListItem.defaultProps = {
  button: false,
};

export default ListItem;
