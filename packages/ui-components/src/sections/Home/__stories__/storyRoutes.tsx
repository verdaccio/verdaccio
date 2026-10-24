import { HttpResponse, http } from 'msw';
import React from 'react';
import { Link, Route, useLocation } from 'react-router';

import VersionPage from '../../../pages/Version';
import { VersionProvider } from '../../../providers';
import { Route as AppRoute } from '../../../utils';
import { registryPackages } from './storyFixtures';

const DATA_URL = 'https://my.company.example/-/verdaccio/data';

const packageFromRequest = (request: Request, endpoint: string) => {
  const { pathname } = new URL(request.url);
  const name = decodeURIComponent(pathname.split(`/-/verdaccio/data/${endpoint}/`)[1] ?? '');
  return registryPackages.find((pkg) => pkg.name === name);
};

const sidebarFor = (pkg: (typeof registryPackages)[number]) => ({
  _id: pkg.name,
  latest: pkg,
  versions: { [pkg.version]: pkg },
  'dist-tags': { latest: pkg.version },
  time: { created: pkg.time, modified: pkg.time, [pkg.version]: pkg.time },
  _uplinks: {},
});

/** Serve the package page of every story package, so links from the home list open it. */
export const packagePageHandlers = [
  http.get(`${DATA_URL}/sidebar/*`, ({ request }) => {
    const pkg = packageFromRequest(request, 'sidebar');
    return pkg
      ? HttpResponse.json(sidebarFor(pkg))
      : HttpResponse.json({ error: 'not found' }, { status: 404 });
  }),
  http.get(`${DATA_URL}/package/readme/*`, ({ request }) => {
    const pkg = packageFromRequest(request, 'package/readme');
    return pkg
      ? HttpResponse.json(`# ${pkg.name}\n\n${pkg.description}`)
      : HttpResponse.json({ error: 'not found' }, { status: 404 });
  }),
];

const versionElement = (
  <VersionProvider>
    <VersionPage />
  </VersionProvider>
);

/** The detail and version routes of the app, for stories that start on the home page. */
export const packagePageRoutes = [
  AppRoute.SCOPE_PACKAGE_VERSION,
  AppRoute.SCOPE_PACKAGE,
  AppRoute.PACKAGE_VERSION,
  AppRoute.PACKAGE,
].map((path) => <Route element={versionElement} key={path} path={path} />);

/** A way back to the list in stories without a header. */
export const BackToList: React.FC = () => {
  const { pathname } = useLocation();
  return pathname === '/' ? null : (
    <div style={{ padding: '8px 16px' }}>
      <Link to="/">{'← Back to the package list'}</Link>
    </div>
  );
};
