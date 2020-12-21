import { default as MaterialUICard, CardProps } from '@material-ui/core/Card';
import React, { forwardRef } from 'react';

type CardRef = HTMLDivElement;

const Card = forwardRef<CardRef, CardProps>(function Card(props, ref) {
  return <MaterialUICard {...props} ref={ref} />;
});

export default Card;
