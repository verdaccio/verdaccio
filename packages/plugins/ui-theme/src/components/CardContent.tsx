import { CardContentProps, default as MaterialUICardContent } from '@mui/material/CardContent';
import React, { forwardRef } from 'react';

type CardContentRef = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];

const CardContent = forwardRef<CardContentRef, CardContentProps>(function CardContent(props) {
  return <MaterialUICardContent {...props} />;
});

export default CardContent;
