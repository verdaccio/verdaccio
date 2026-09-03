import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import type { ReactNode } from 'react';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useTarballDownload } from '../../api/use-data-mutation';
import { downloadFile, extractFileName } from '../../utils/url';

export interface DownloadContextProps {
  downloadTarball: (args: { link: string }) => Promise<void>;
  isDownloading: boolean;
  hasDownloadError: boolean;
}

export const DownloadContext = createContext<DownloadContextProps | undefined>(undefined);

export const DownloadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const { download, isDownloading } = useTarballDownload();
  const [hasDownloadError, setHasDownloadError] = useState(false);

  const downloadTarball = useCallback(
    async ({ link }: { link: string }) => {
      try {
        setHasDownloadError(false);
        const fileStream = await download({ link });
        if (!fileStream) {
          // clicking download and having nothing happen sends the user
          // retrying blindly; an empty response is an error too
          setHasDownloadError(true);
          return;
        }

        const fileName = extractFileName(link);
        downloadFile(fileStream, fileName);
      } catch (error) {
        console.error('Error during tarball download:', error);
        setHasDownloadError(true);
      }
    },
    [download]
  );

  return (
    <DownloadContext.Provider value={{ downloadTarball, isDownloading, hasDownloadError }}>
      {children}
      <Snackbar
        autoHideDuration={6000}
        onClose={() => setHasDownloadError(false)}
        open={hasDownloadError}
      >
        <Alert onClose={() => setHasDownloadError(false)} severity="error" variant="filled">
          {t('error.download-tarball')}
        </Alert>
      </Snackbar>
    </DownloadContext.Provider>
  );
};

export const useDownload = () => {
  const context = useContext(DownloadContext);
  if (!context) {
    throw new Error('useDownload must be used within a DownloadProvider');
  }
  return context;
};
