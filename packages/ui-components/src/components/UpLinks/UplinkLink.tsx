import React from 'react';

import { utils } from '../../utils';
import LinkExternal from '../LinkExternal';

const UpLinkLink: React.FC<{ packageName: string; uplinkName: string }> = ({
  packageName,
  uplinkName,
}) => {
  const link = utils.getUplink(uplinkName, packageName);
  return link ? (
    <LinkExternal to={link} variant="outline">
      {uplinkName}
    </LinkExternal>
  ) : (
    <>{uplinkName}</>
  );
};

export default UpLinkLink;
