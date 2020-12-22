import styled from '@emotion/styled';
import { default as MaterialUIMenuItem, MenuItemProps } from '@material-ui/core/MenuItem';
import React, { forwardRef } from 'react';

type HTMLElementTagName = keyof HTMLElementTagNameMap;
type MenuItemRef = HTMLElementTagNameMap[HTMLElementTagName];

interface Props extends Omit<MenuItemProps, 'component'> {
  component?: HTMLElementTagName;
}

const MenuItem = forwardRef<MenuItemRef, Props>(function MenuItem(props, ref) {
  // it seems typescript has some discrimination type limitions. Please see: https://github.com/mui-org/material-ui/issues/14971
  // @ts-ignore Type Types of property 'button' are incompatible.
  return <StyledMaterialUIMenuItem {...props} ref={ref as any} />;
});

MenuItem.defaultProps = {
  component: 'li',
};

export default MenuItem;
const StyledMaterialUIMenuItem = styled(MaterialUIMenuItem)({
  outline: 'none',
});
