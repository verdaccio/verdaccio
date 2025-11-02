import styled from '@emotion/styled';
import type { MenuItemProps } from '@mui/material/MenuItem';
import { default as MaterialUIMenuItem } from '@mui/material/MenuItem';
import React from 'react';

type HTMLElementTagName = keyof HTMLElementTagNameMap;
type MenuItemRef = HTMLElementTagNameMap[HTMLElementTagName];

interface Props extends Omit<MenuItemProps, 'component'> {
  component?: HTMLElementTagName;
}

const MenuItem = function MenuItem({
  ref,
  component = 'li',
  ...props
}: Props & { ref?: React.RefObject<MenuItemRef | null> }) {
  // it seems typescript has some discrimination type limitions. Please see: https://github.com/mui-org/material-ui/issues/14971
  // @ts-ignore Type Types of property 'button' are incompatible.
  return <StyledMaterialUIMenuItem component={component} {...props} ref={ref as any} />;
};

export default MenuItem;
const StyledMaterialUIMenuItem = styled(MaterialUIMenuItem)({
  outline: 'none',
});
