import { default as MaterialUISvgIcon, SvgIconProps } from '@material-ui/core/SvgIcon';
import React, { forwardRef } from 'react';

type SvgIconRef = SVGSVGElement;

const SvgIcon = forwardRef<SvgIconRef, SvgIconProps>(function SvgIcon(props, ref) {
  return <MaterialUISvgIcon {...props} ref={ref} />;
});

export default SvgIcon;
