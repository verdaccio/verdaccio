import { default as MaterialUIMenu, MenuProps } from '@mui/material/Menu';
import React, { forwardRef } from 'react';

type MenuRef = HTMLDivElement;

const Menu = forwardRef<MenuRef, MenuProps>(function Menu(props, ref) {
  return <MaterialUIMenu {...props} ref={ref} />;
});

export default Menu;
