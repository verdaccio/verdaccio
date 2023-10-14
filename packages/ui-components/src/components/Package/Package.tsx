import { css } from '@emotion/react';
import styled from '@emotion/styled';
import BugReport from '@mui/icons-material/BugReport';
import DownloadIcon from '@mui/icons-material/CloudDownload';
import HomeIcon from '@mui/icons-material/Home';
import { useTheme } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import Tooltip from '@mui/material/Tooltip';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Dispatch, Link, RootState, Theme } from '../../';
import { FileBinary, Law, Time, Version } from '../../components/Icons';
import { Author as PackageAuthor, PackageMetaInterface } from '../../types/packageMeta';
import { url, utils } from '../../utils';
import Tag from './Tag';
import {
  Author,
  Avatar,
  Description,
  Details,
  GridRightAligned,
  IconButton,
  OverviewItem,
  PackageListItemText,
  PackageTitle,
  Published,
  TagContainer,
  Wrapper,
  WrapperLink,
} from './styles';

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
  showDownload?: boolean;
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
  showDownload = true,
  version,
}) => {
  const config = useSelector((state: RootState) => state.configuration.config);
  const dispatch = useDispatch<Dispatch>();
  const { t } = useTranslation();
  const theme = useTheme();
  const isLoading = useSelector((state: RootState) => state?.loading?.models.download);

  const handleDownload = useCallback(
    async (tarballDist: string) => {
      // FIXME: check, the dist might be different thant npmjs
      const link = tarballDist.replace(`https://registry.npmjs.org/`, config.base);
      dispatch.download.getTarball({ link });
    },
    [dispatch, config]
  );

  const renderVersionInfo = (): React.ReactNode =>
    version && (
      <OverviewItem>
        <StyledVersion />
        {t('package.version', { version })}
      </OverviewItem>
    );

  const renderAuthorInfo = (): React.ReactNode => {
    const name = utils.getAuthorName(authorName);
    return (
      <Author>
        <Avatar alt={name} src={authorAvatar} />
        <Details>
          <div
            style={{
              fontSize: '12px',
              fontWeight: theme?.fontWeight.semiBold,
              color:
                theme?.palette.mode === 'light' ? theme?.palette.greyLight2 : theme?.palette.white,
            }}
          >
            {name}
          </div>
        </Details>
      </Author>
    );
  };

  const renderFileSize = (): React.ReactNode =>
    dist?.unpackedSize && (
      <OverviewItem>
        <StyledFileBinary />
        {utils.fileSizeSI(dist.unpackedSize)}
      </OverviewItem>
    );

  const renderLicenseInfo = (): React.ReactNode =>
    license && (
      <OverviewItem>
        <StyledLaw />
        {license as string}
      </OverviewItem>
    );

  const renderPublishedInfo = (): React.ReactNode =>
    time && (
      <OverviewItem>
        <StyledTime />
        <Published>{t('package.published-on', { time: utils.formatDate(time) })}</Published>
        {utils.formatDateDistance(time)}
      </OverviewItem>
    );

  const renderHomePageLink = (): React.ReactNode =>
    homepage &&
    url.isURL(homepage) && (
      <Link external={true} to={homepage}>
        <Tooltip aria-label={t('package.homepage')} title={t('package.visit-home-page')}>
          <IconButton aria-label={t('package.homepage')} size="large">
            <HomeIcon />
          </IconButton>
        </Tooltip>
      </Link>
    );

  const renderBugsLink = (): React.ReactNode =>
    bugs?.url &&
    url.isURL(bugs.url) && (
      <Link external={true} to={bugs.url}>
        <Tooltip aria-label={t('package.bugs')} title={t('package.open-an-issue')}>
          <IconButton aria-label={t('package.bugs')} size="large">
            <BugReport />
          </IconButton>
        </Tooltip>
      </Link>
    );

  const renderDownloadLink = (): React.ReactNode =>
    dist?.tarball &&
    url.isURL(dist.tarball) && (
      <Link
        onClick={() => {
          handleDownload(dist.tarball);
        }}
        to="#"
      >
        <Tooltip
          aria-label={t('package.download', { what: t('package.the-tar-file') })}
          title={t('package.tarball')}
        >
          <IconButton aria-label={t('package.download')} size="large">
            {isLoading ? (
              <CircularProgress size={13}>
                <DownloadIcon />
              </CircularProgress>
            ) : (
              <DownloadIcon />
            )}
          </IconButton>
        </Tooltip>
      </Link>
    );

  const renderPrimaryComponent = (): React.ReactNode => {
    return (
      <Grid container={true} item={true} xs={12}>
        <Grid item={true} xs={11}>
          <WrapperLink to={`/-/web/detail/${packageName}`}>
            <PackageTitle className="package-title" data-testid="package-title">
              {packageName}
            </PackageTitle>
          </WrapperLink>
        </Grid>
        <GridRightAligned
          alignItems="center"
          container={true}
          item={true}
          justify="flex-end"
          spacing={3}
          xs={true}
        >
          {renderHomePageLink()}
          {renderBugsLink()}
          {showDownload && renderDownloadLink()}
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
  fill: ${theme?.palette.mode === 'light' ? theme?.palette.greyLight2 : theme?.palette.white};
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
