import { PackageMetaInterface } from '../../types/packageMeta';

export interface DetailContextProps {
  hasNotBeenFound: boolean;
  isLoading: boolean;
  packageMeta: PackageMetaInterface;
  packageName: string;
  packageVersion?: string;
  readMe: string;
}

export interface VersionPageConsumerProps {
  packageMeta: PackageMetaInterface;
  packageName: string;
  packageVersion?: string;
  readMe: string;
}
