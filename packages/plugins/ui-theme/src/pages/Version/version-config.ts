import { PackageMetaInterface } from '../../../types/packageMeta';

export interface DetailContextProps {
  enableLoading: () => void;
  hasNotBeenFound: boolean;
  isLoading: boolean;
  packageMeta: PackageMetaInterface;
  packageName: string;
  packageVersion?: string;
  readMe: string;
}

export interface VersionPageConsumerProps {
  enableLoading: () => void;
  packageMeta: PackageMetaInterface;
  packageName: string;
  packageVersion?: string;
  readMe: string;
}
