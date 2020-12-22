import React from 'react';

import Tooltip from 'verdaccio-ui/components/Tooltip';

import HeaderToolTipIcon, { TooltipIconType } from './HeaderToolTipIcon';

interface Props {
  title: string;
  tooltipIconType: TooltipIconType;
  onClick?: () => void;
}

const HeaderToolTip: React.FC<Props> = ({ tooltipIconType, title, onClick }) => (
  <Tooltip disableFocusListener={true} title={title}>
    <HeaderToolTipIcon onClick={onClick} tooltipIconType={tooltipIconType} />
  </Tooltip>
);

export default HeaderToolTip;
