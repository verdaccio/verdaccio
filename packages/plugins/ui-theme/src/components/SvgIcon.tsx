import styled from '@emotion/styled';
import { default as MaterialUISvgIcon, SvgIconProps } from '@material-ui/core/SvgIcon';
import React from 'react';

type Size = 'sm' | 'md';

type Props = Omit<SvgIconProps, 'color' | 'fontsize' | 'name'> & {
  size?: Size;
  title?: string;
  className?: string;
};

const SvgIcon = React.forwardRef<SVGSVGElement, Props>(function SvgIcon(
  { size = 'md', title, ...props },
  ref
) {
  return <StyledMaterialUISvgIcon size={size} titleAccess={title} {...props} ref={ref} />;
});

export { SvgIcon };

const getSize = (size: Size) => {
  if (size === 'md') {
    return {
      width: 18,
      height: 18,
    };
  }

  return {
    width: 14,
    height: 16,
  };
};

const StyledMaterialUISvgIcon = styled(MaterialUISvgIcon)<{ size: Size }>(({ size }) => ({
  ...getSize(size),
}));
