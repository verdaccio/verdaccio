import Link from '@mui/material/Link';
import React from 'react';

import { Logo, Search } from '../../';
import { LeftSide, SearchWrapper } from './styles';

interface Props {
  showSearch?: boolean;
}

const HeaderLeft: React.FC<Props> = ({ showSearch }) => (
  <LeftSide>
    <Link to={'/'}>
      <Logo size="small" />
    </Link>
    {showSearch && (
      <SearchWrapper data-testid="search-container">
        <Search />
      </SearchWrapper>
    )}
  </LeftSide>
);

export default HeaderLeft;
