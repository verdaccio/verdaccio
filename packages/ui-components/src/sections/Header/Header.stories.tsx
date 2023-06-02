import React from 'react';
import { MemoryRouter, Route } from 'react-router';

import { HeaderInfoDialog } from '../../';
import { VersionProvider } from '../../providers';
import Header from './Header';

export default {
  title: 'Sections/Header',
};

function CustomInfoDialog({ onCloseDialog, title, isOpen }) {
  return (
    <HeaderInfoDialog
      dialogTitle={title}
      isOpen={isOpen}
      onCloseDialog={onCloseDialog}
      tabPanels={[
        { element: <div>{'foo'}</div> },
        { element: <div>{'bar'}</div> },
        { element: <div>{'fooBar'}</div> },
      ]}
      tabs={[{ label: 'foo' }, { label: 'bar' }, { label: 'barFoo' }]}
    />
  );
}

export const HeaderAll: any = () => (
  <MemoryRouter initialEntries={[`/-/web/detail/storybook`]}>
    <Route exact={true} path="/-/web/detail/:package">
      <VersionProvider>
        <Header HeaderInfoDialog={CustomInfoDialog} />
      </VersionProvider>
    </Route>
  </MemoryRouter>
);
