import Toolbar from '@mui/material/Toolbar';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Logo, Search } from '../../';
import { SearchWrapper } from './styles';

interface Props {
  showSearch?: boolean;
}

const HeaderLeft: React.FC<Props> = ({ showSearch }) => (
  <Toolbar
    sx={{
      display: 'flex',
      padding: 0,
      marginLeft: 0,
      flex: 1,
      '@media (min-width: 600px)': {
        padding: 0,
        marginLeft: 0,
        marginRight: '20px',
      },
    }}
  >
    <RouterLink to={'/'}>
      <Logo />
    </RouterLink>
    {showSearch && (
      <SearchWrapper data-testid="search-container">
        <Search />
      </SearchWrapper>
    )}
  </Toolbar>
);

export default HeaderLeft;
