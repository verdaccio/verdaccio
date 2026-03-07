import styled from '@emotion/styled';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import { default as MaterialUISvgIcon } from '@mui/material/SvgIcon';
import React from 'react';

type Size = 'sm' | 'md';

type Props = Omit<SvgIconProps, 'color' | 'fontsize' | 'name'> & {
  size?: Size;
  title?: string;
  className?: string;
};

const SvgIcon = function SvgIcon({
  ref,
  size = 'md',
  title,
  ...props
}: Props & { ref?: React.RefObject<SVGSVGElement | null> }) {
  return <StyledMaterialUISvgIcon size={size} titleAccess={title} {...props} ref={ref} />;
};

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
