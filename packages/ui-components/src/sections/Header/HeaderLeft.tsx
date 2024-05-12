import React from 'react';
import { useHistory } from 'react-router-dom';

import { Logo, Search } from '../../';
import { LeftSide, SearchWrapper } from './styles';

interface Props {
  showSearch?: boolean;
}

const HeaderLeft: React.FC<Props> = ({ showSearch }) => (
  <LeftSide>
    <Logo onClick={useHistory().push('/')} size="small" />
    {showSearch && (
      <SearchWrapper data-testid="search-container">
        <Search />
      </SearchWrapper>
    )}
  </LeftSide>
);

export default HeaderLeft;
