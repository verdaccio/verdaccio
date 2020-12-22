import React, { ReactNode } from 'react';

import { Wrapper } from './styles';

interface Props {
  children: ReactNode;
}

const Tag: React.FC<Props> = ({ children }) => <Wrapper>{children}</Wrapper>;

export default Tag;
