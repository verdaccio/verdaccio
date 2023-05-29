import React from 'react';
import { MemoryRouter, Route } from 'react-router';

import Home from './Home';

export default {
  title: 'Sections/Home',
};

export const HomeDefault: any = () => (
  <MemoryRouter initialEntries={[`/`]}>
    <Route exact={true} path="/">
      <Home />
    </Route>
  </MemoryRouter>
);
