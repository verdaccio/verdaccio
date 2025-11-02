import React, { ReactElement, createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { useData } from '../../api/use-data';
import { useTarballDownload } from '../../api/use-data-mutation';
import { getConfiguration } from '../../configuration';
import { APIRoute } from '../../store/routes';
import { stripTrailingSlash } from '../../store/utils';
import { PackageMetaInterface } from '../../types/packageMeta';
import { downloadFile, extractFileName } from '../../utils/url';

function getRouterPackageName(packageName: string, scope?: string): string {
  return scope ? `@${scope}/${packageName}` : packageName;
}

export interface DetailContextProps {
  error: any;
  hasNotBeenFound: boolean;
  isForbidden: boolean;
  isUnAuthorized: boolean;
  isError: boolean;
  isLoading: boolean;
  packageMeta?: PackageMetaInterface;
  packageName: string;
  packageVersion?: string;
  readMe?: string;
  downloadTarball?: (args: { link: string }) => Promise<void>;
  isDownloadingTarball?: boolean;
}

export const DetailContext = createContext<Partial<DetailContextProps>>({});

interface Params {
  scope?: string;
  package: string;
  version?: string;
}

const configuration = getConfiguration();

const VersionProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
  const { scope, package: pkgName, version: packageVersion } = useParams<Params>();

  const basePath = stripTrailingSlash(configuration.base);
  const packageName = getRouterPackageName(pkgName, scope);

  const readmeData = useData<string>(basePath, APIRoute.README, packageName, packageVersion);

  const sidebarData = useData<PackageMetaInterface>(
    basePath,
    APIRoute.SIDEBAR,
    packageName,
    packageVersion
  );

  const { download, isDownloading } = useTarballDownload();

  const downloadTarball = async ({ link }: { link: string }) => {
    try {
      const fileStream = await download({ link });
      if (!fileStream) {
        return;
      }

      const fileName = extractFileName(link);
      downloadFile(fileStream, fileName);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('error on download', error);
    }
  };

  const isLoading = readmeData.isLoading || sidebarData.isLoading;
  const errorCode = readmeData.error?.code ?? sidebarData.error?.code;

  return (
    <DetailContext.Provider
      value={{
        packageMeta: sidebarData.data,
        readMe: readmeData.data,
        packageName,
        packageVersion,
        isLoading,
        isForbidden: errorCode === 403,
        isUnAuthorized: errorCode === 401,
        hasNotBeenFound: errorCode === 404,
        isError: typeof errorCode !== 'undefined',
        error: readmeData.error || sidebarData.error,
        downloadTarball,
        isDownloadingTarball: isDownloading,
      }}
    >
      {children}
    </DetailContext.Provider>
  );
};

export default VersionProvider;

export const useVersion = () => useContext(DetailContext);
