import { default as MaterialUICardContent, CardContentProps } from '@material-ui/core/CardContent';
import React, { forwardRef } from 'react';

type CardContentRef = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];

const CardContent = forwardRef<CardContentRef, CardContentProps>(function CardContent(props, ref) {
  return <MaterialUICardContent {...props} innerRef={ref} />;
});

export default CardContent;
