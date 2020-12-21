import React from 'react';

import { preventXSS } from 'verdaccio-ui/utils/sec-utils';

import Readme from './Readme';

interface Props {
  description?: string;
}

const DetailContainerContentReadme: React.FC<Props> = ({ description }) => {
  if (!description) {return null;}
  const encodedReadme = preventXSS(description);
  return <Readme description={encodedReadme} />;
};

export default DetailContainerContentReadme;
