import React from 'react';

import { isURL } from 'verdaccio-ui/utils/url';

import { DetailContext } from '../../pages/Version';
import Box from '../Box';

import ActionBarAction, { ActionBarActionProps } from './ActionBarAction';

/* eslint-disable verdaccio/jsx-spread */
const ActionBar: React.FC = () => {
  const detailContext = React.useContext(DetailContext);

  const { packageMeta } = detailContext;

  if (!packageMeta?.latest) {
    return null;
  }

  const { homepage, bugs, dist } = packageMeta.latest;

  const actions: ActionBarActionProps[] = [];

  if (homepage && isURL(homepage)) {
    actions.push({ type: 'VISIT_HOMEPAGE', link: homepage });
  }

  if (bugs?.url && isURL(bugs.url)) {
    actions.push({ type: 'OPEN_AN_ISSUE', link: bugs.url });
  }

  if (dist?.tarball && isURL(dist.tarball)) {
    actions.push({ type: 'DOWNLOAD_TARBALL', link: dist.tarball });
  }

  return (
    <Box alignItems="center" display="flex" marginBottom="8px">
      {actions.map((action) => (
        <ActionBarAction key={action.link} {...action} />
      ))}
    </Box>
  );
};

export default ActionBar;
