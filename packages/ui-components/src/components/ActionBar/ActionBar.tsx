/* eslint-disable verdaccio/jsx-spread */
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import React, { useState } from 'react';

import { url } from '../../utils';
import RawViewer from '../RawViewer';
import ActionBarAction, { ActionBarActionProps } from './ActionBarAction';

export type Props = {
  showRaw?: boolean;
  showDownloadTarball?: boolean;
  packageMeta: any;
};

const ActionBar: React.FC<Props> = ({ showRaw, showDownloadTarball = true, packageMeta }) => {
  const [isRawViewerOpen, setIsRawViewerOpen] = useState(false);

  if (!packageMeta?.latest) {
    return null;
  }

  const { homepage, bugs, dist } = packageMeta.latest;

  const actions: ActionBarActionProps[] = [];

  if (homepage && url.isURL(homepage)) {
    actions.push({ type: 'VISIT_HOMEPAGE', link: homepage });
  }

  if (bugs?.url && url.isURL(bugs.url)) {
    actions.push({ type: 'OPEN_AN_ISSUE', link: bugs.url });
  }

  if (dist?.tarball && url.isURL(dist.tarball) && showDownloadTarball) {
    actions.push({ type: 'DOWNLOAD_TARBALL', link: dist.tarball });
  }

  if (showRaw) {
    actions.push({ type: 'RAW_DATA', action: () => setIsRawViewerOpen(true) });
  }

  return (
    <Box alignItems="center" display="flex" sx={{ my: 2 }}>
      <Stack direction="row" spacing={1}>
        {actions.map((action) => (
          <ActionBarAction key={action.type} {...action} />
        ))}
        {isRawViewerOpen && (
          <RawViewer
            isOpen={isRawViewerOpen}
            onClose={() => {
              setIsRawViewerOpen(false);
            }}
            packageMeta={packageMeta}
          />
        )}
      </Stack>
    </Box>
  );
};

export default ActionBar;
