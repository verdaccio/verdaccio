import React from 'react';

import Text from 'verdaccio-ui/components/Text';

interface Props {
  text: string;
  className?: string;
}

const NoItems: React.FC<Props> = ({ className, text }) => (
  <Text className={className} gutterBottom={true} variant="subtitle1">
    {text}
  </Text>
);

export default NoItems;
