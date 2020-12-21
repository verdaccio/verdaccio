import { css } from '@emotion/core';
import styled from '@emotion/styled';
import BugReport from '@material-ui/icons/BugReport';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import HomeIcon from '@material-ui/icons/Home';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { downloadTarball } from 'verdaccio-ui/components/ActionBar';
import Grid from 'verdaccio-ui/components/Grid';
import { Version, FileBinary, Time, Law } from 'verdaccio-ui/components/Icons';
import Link from 'verdaccio-ui/components/Link';
import ListItem from 'verdaccio-ui/components/ListItem';
import Tooltip from 'verdaccio-ui/components/Tooltip';
import { Theme } from 'verdaccio-ui/design-tokens/theme';
import fileSizeSI from 'verdaccio-ui/utils/file-size';
import { formatDate, formatDateDistance, getAuthorName } from 'verdaccio-ui/utils/package';
import { isURL } from 'verdaccio-ui/utils/url';

import { PackageMetaInterface, Author as PackageAuthor } from '../../../../../types/packageMeta';

import {
  Author,
  Avatar,
  Description,
  Details,
  GridRightAligned,
  IconButton,
  OverviewItem,
  Wrapper,
  PackageListItemText,
  PackageTitle,
  Published,
  TagContainer,
  Text,
  WrapperLink,
} from './styles';
import Tag from './Tag';

interface Bugs {
  url: string;
}
interface Dist {
  unpackedSize: number;
  tarball: string;
}

export interface PackageInterface {
  name: string;
  version: string;
  time?: number | string;
  author: PackageAuthor;
  description?: string;
  keywords?: string[];
  license?: PackageMetaInterface['latest']['license'];
  homepage?: string;
  bugs?: Bugs;
  dist?: Dist;
}

const Package: React.FC<PackageInterface> = ({
  author: { name: authorName, avatar: authorAvatar },
  bugs,
  description,
  dist,
  homepage,
  keywords = [],
  license,
  name: packageName,
  time,
  version,
}) => {
  const { t } = useTranslation();

  const renderVersionInfo = (): React.ReactNode =>
    version && (
      <OverviewItem>
        <StyledVersion />
        {t('package.version', { version })}
      </OverviewItem>
    );

  const renderAuthorInfo = (): React.ReactNode => {
    const name = getAuthorName(authorName);
    return (
      <Author>
        <Avatar alt={name} src={authorAvatar} />
        <Details>
          <Text text={name} />
        </Details>
      </Author>
    );
  };

  const renderFileSize = (): React.ReactNode =>
    dist &&
    dist.unpackedSize && (
      <OverviewItem>
        <StyledFileBinary />
        {fileSizeSI(dist.unpackedSize)}
      </OverviewItem>
    );

  const renderLicenseInfo = (): React.ReactNode =>
    license && (
      <OverviewItem>
        <StyledLaw />
        {license}
      </OverviewItem>
    );

  const renderPublishedInfo = (): React.ReactNode =>
    time && (
      <OverviewItem>
        <StyledTime />
        <Published>{t('package.published-on', { time: formatDate(time) })}</Published>
        {formatDateDistance(time)}
      </OverviewItem>
    );

  const renderHomePageLink = (): React.ReactNode =>
    homepage &&
    isURL(homepage) && (
      <Link external={true} to={homepage}>
        <Tooltip aria-label={t('package.homepage')} title={t('package.visit-home-page')}>
          <IconButton aria-label={t('package.homepage')}>
            <HomeIcon />
          </IconButton>
        </Tooltip>
      </Link>
    );

  const renderBugsLink = (): React.ReactNode =>
    bugs &&
    bugs.url &&
    isURL(bugs.url) && (
      <Link external={true} to={bugs.url}>
        <Tooltip aria-label={t('package.bugs')} title={t('package.open-an-issue')}>
          <IconButton aria-label={t('package.bugs')}>
            <BugReport />
          </IconButton>
        </Tooltip>
      </Link>
    );

  const renderDownloadLink = (): React.ReactNode =>
    dist &&
    dist.tarball &&
    isURL(dist.tarball) && (
      // eslint-disable-next-line
      <Link
        external={true}
        onClick={downloadTarball(
          dist.tarball.replace(`https://registry.npmjs.org/`, window.location.href)
        )}
        to="#">
        <Tooltip
          aria-label={t('package.download', { what: t('package.the-tar-file') })}
          title={t('package.tarball')}>
          <IconButton aria-label={t('package.download')}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </Link>
    );

  const renderPrimaryComponent = (): React.ReactNode => {
    return (
      <Grid container={true} item={true} xs={12}>
        <Grid item={true} xs={true}>
          <WrapperLink to={`/-/web/detail/${packageName}`}>
            <PackageTitle className="package-title">{packageName}</PackageTitle>
          </WrapperLink>
        </Grid>
        <GridRightAligned
          alignItems="center"
          container={true}
          item={true}
          justify="flex-end"
          xs={true}>
          {renderHomePageLink()}
          {renderBugsLink()}
          {renderDownloadLink()}
        </GridRightAligned>
      </Grid>
    );
  };

  const renderSecondaryComponent = (): React.ReactNode => {
    const tags = keywords.sort().map((keyword, index) => <Tag key={index}>{keyword}</Tag>);
    return (
      <>
        <Description>{description}</Description>
        {tags.length > 0 && <TagContainer>{tags}</TagContainer>}
      </>
    );
  };

  const renderPackageListItemText = (): React.ReactNode => (
    <PackageListItemText
      className="package-link"
      // @ts-ignore
      component="div"
      primary={renderPrimaryComponent()}
      secondary={renderSecondaryComponent()}
    />
  );

  return (
    <Wrapper className={'package'} data-testid="package-item-list">
      <ListItem alignItems={'flex-start'}>{renderPackageListItemText()}</ListItem>
      <ListItem alignItems={'flex-start'}>
        {renderAuthorInfo()}
        {renderVersionInfo()}
        {renderPublishedInfo()}
        {renderFileSize()}
        {renderLicenseInfo()}
      </ListItem>
    </Wrapper>
  );
};

export default Package;

const iconStyle = ({ theme }: { theme: Theme }) => css`
  margin: 2px 10px 0 0;
  fill: ${theme?.palette.type === 'light' ? theme?.palette.greyLight2 : theme?.palette.white};
`;

const StyledVersion = styled(Version)`
  ${iconStyle};
`;

const StyledFileBinary = styled(FileBinary)`
  ${iconStyle};
`;

const StyledLaw = styled(Law)`
  ${iconStyle};
`;

const StyledTime = styled(Time)`
  ${iconStyle};
`;
