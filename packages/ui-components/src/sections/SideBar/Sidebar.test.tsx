import { rest } from 'msw';
import React from 'react';
import { MemoryRouter } from 'react-router';

import { server } from '../../../jest/server';
import { VersionProvider } from '../../providers';
import { store } from '../../store';
import { renderWithStore, screen, waitFor } from '../../test/test-react-testing-library';
import DetailSidebar from './Sidebar';

jest.mock('marked');
jest.mock('marked');
jest.mock('marked-highlight');

const ComponentToBeRendered: React.FC = () => (
  <MemoryRouter>
    <VersionProvider>
      <DetailSidebar />
    </VersionProvider>
  </MemoryRouter>
);

// https://stackoverflow.com/a/54010619/308341
jest.mock('react', () => {
  const React = jest.requireActual('react');
  React.Suspense = ({ children }) => children;
  return React;
});

const packageMeta = {
  _uplinks: {},
  latest: {
    name: 'verdaccio-ui/local-storage',
    version: '8.0.1-next.1',
    dist: {
      fileCount: 0,
      unpackedSize: 0,
      tarball: 'http://localhost:8080/bootstrap/-/bootstrap-4.3.1.tgz',
    },
    homepage: 'https://verdaccio.org',
    bugs: {
      url: 'https://github.com/verdaccio/monorepo/issues',
    },
  },
};

// const detailContextValue = {
//   packageName: 'foo',
//   readMe: 'test',
//   isLoading: false,
//   hasNotBeenFound: false,
//   packageMeta: ,
// };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    package: 'jquery',
  }),
}));

server.use(
  ...[
    rest.get('http://localhost:9000/-/verdaccio/data/sidebar/jquery', (req, res, ctx) => {
      return res(ctx.json(packageMeta));
    }),
    rest.get('http://localhost:9000/-/verdaccio/data/package/readme/jquery', (req, res, ctx) => {
      return res(ctx.text('foo readme'));
    }),
  ]
);
// describe('DetailSidebar', () => {
test.skip('should render commonjs module icon', async () => {
  const { getByText } = renderWithStore(<ComponentToBeRendered />, store);
  screen.debug();
  await waitFor(() => expect(getByText('jquery')).toBeInTheDocument());
});

//   test('should render ts module icon', () => {
//     renderWithStore(
//       <ComponentToBeRendered
//         contextValue={_.merge(detailContextValue, {
//           packageMeta: {
//             latest: {
//               types: './src/index.d.ts',
//             },
//           },
//         })}
//       />,
//       store
//     );
//     expect(screen.getByAltText('typescript')).toBeInTheDocument();
//   });

//   test('should render es6 module icon', () => {
//     renderWithStore(
//       <ComponentToBeRendered
//         contextValue={_.merge(detailContextValue, {
//           packageMeta: {
//             latest: {
//               type: 'module',
//             },
//           },
//         })}
//       />,
//       store
//     );
//     expect(screen.getByAltText('es6 modules')).toBeInTheDocument();
//   });
// });
