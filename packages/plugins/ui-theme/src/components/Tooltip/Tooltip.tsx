import { default as MaterialUITooltip, TooltipProps } from '@material-ui/core/Tooltip';
import { TFunctionResult } from 'i18next';
import React, { forwardRef } from 'react';

// The default element type of MUI's Tooltip is 'div' and the change of this prop is not allowed
type TooltipRef = HTMLDivElement;

// Returning only the children in case of undefined title was necessary as the Tooltip component no longer accepts this type
// You can read more about this in this issue https://github.com/mui-org/material-ui/issues/20701
type Props = Omit<TooltipProps, 'title'> & {
  title: TFunctionResult;
};

const Tooltip = forwardRef<TooltipRef, Props>(function ToolTip({ title, children, ...props }, ref) {
  if (!title) {
    return children;
  }
  return (
    <MaterialUITooltip {...props} title={title} innerRef={ref}>
      {children}
    </MaterialUITooltip>
  );
});

export default Tooltip;
