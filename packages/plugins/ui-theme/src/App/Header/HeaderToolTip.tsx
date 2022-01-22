import React from 'react';

import HeaderToolTipIcon, { TooltipIconType } from './HeaderToolTipIcon';

interface Props {
  title: string;
  tooltipIconType: TooltipIconType;
  onClick?: () => void;
}

const HeaderToolTip: React.FC<Props> = ({ tooltipIconType, onClick }) => (
  <HeaderToolTipIcon onClick={onClick} tooltipIconType={tooltipIconType} />
);

export default HeaderToolTip;
