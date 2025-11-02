import type { ReactNode } from 'react';
import React, { createContext, useCallback, useContext } from 'react';

import { useTarballDownload } from '../../api/use-data-mutation';
import { downloadFile, extractFileName } from '../../utils/url';

export interface DownloadContextProps {
  downloadTarball: (args: { link: string }) => Promise<void>;
  isDownloading: boolean;
}

export const DownloadContext = createContext<DownloadContextProps | undefined>(undefined);

export const DownloadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { download, isDownloading } = useTarballDownload();

  const downloadTarball = useCallback(
    async ({ link }: { link: string }) => {
      try {
        const fileStream = await download({ link });
        if (!fileStream) return;

        const fileName = extractFileName(link);
        downloadFile(fileStream, fileName);
      } catch (error) {
        console.error('Error during tarball download:', error);
      }
    },
    [download]
  );

  return (
    <DownloadContext.Provider value={{ downloadTarball, isDownloading }}>
      {children}
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
