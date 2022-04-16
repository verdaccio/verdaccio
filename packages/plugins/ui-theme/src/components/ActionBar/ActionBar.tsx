import Box from '@mui/material/Box';
import React, { useState } from 'react';
import { isURL } from 'verdaccio-ui/utils/url';

import { DetailContext } from '../../pages/Version';
import RawViewer from '../RawViewer';
import ActionBarAction, { ActionBarActionProps } from './ActionBarAction';

export type Props = {
  showRaw?: boolean;
  showDownloadTarball?: boolean;
};

/* eslint-disable verdaccio/jsx-spread */
const ActionBar: React.FC<Props> = ({ showRaw, showDownloadTarball = true }) => {
  const [isRawViewerOpen, setIsRawViewerOpen] = useState(false);
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

  if (dist?.tarball && isURL(dist.tarball) && showDownloadTarball) {
    actions.push({ type: 'DOWNLOAD_TARBALL', link: dist.tarball });
  }

  if (showRaw) {
    actions.push({ type: 'RAW_DATA', action: () => setIsRawViewerOpen(true) });
  }

  return (
    <Box alignItems="center" display="flex" marginBottom="14px">
      {actions.map((action) => (
        <ActionBarAction key={action.type} {...action} />
      ))}
      {isRawViewerOpen && (
        <RawViewer
          isOpen={isRawViewerOpen}
          onClose={() => {
            setIsRawViewerOpen(false);
          }}
        />
      )}
    </Box>
  );
};

export default ActionBar;
