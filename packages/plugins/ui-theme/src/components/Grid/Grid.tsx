import { default as MaterialUIGrid, GridProps } from '@material-ui/core/Grid';
import React, { forwardRef } from 'react';

type GridRef = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];

const Grid = forwardRef<GridRef, GridProps>(function Grid(props, ref) {
  return <MaterialUIGrid {...props} innerRef={ref} />;
});

export default Grid;
