import React from 'react';

import Readme from '../../components/Readme';

interface Props {
  description?: string;
}

const DetailContainerContentReadme: React.FC<Props> = ({ description }) => {
  if (!description) {
    return null;
  }

  return <Readme description={description} />;
};

export default DetailContainerContentReadme;
