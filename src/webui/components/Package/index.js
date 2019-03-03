/**
 * @prettier
 * @flow
 */
import React from 'react';
import type { Element } from 'react';

import BugReport from '@material-ui/icons/BugReport';
import Grid from '@material-ui/core/Grid/index';
import HomeIcon from '@material-ui/icons/Home';
import ListItem from '@material-ui/core/ListItem/index';
import Tooltip from '@material-ui/core/Tooltip/index';

import Tag from '../Tag';
import fileSizeSI from '../../utils/file-size';
import { formatDate, formatDateDistance } from '../../utils/package';
import { IProps } from './types';

import {
  Author,
  Avatar,
  Description,
  Details,
  GridRightAligned,
  Icon,
  IconButton,
  OverviewItem,
  PackageList,
  PackageListItem,
  PackageListItemText,
  PackageTitle,
  Published,
  TagContainer,
  Text,
  WrapperLink,
} from './styles';

const Package = ({
  author: { name: authorName, avatar: authorAvatar },
  bugs: { url } = {},
  description,
  dist: { unpackedSize } = {},
  homepage,
  keywords = [],
  license,
  name: packageName,
  time,
  version,
}: IProps): Element<WrapperLink> => {
  //
  const renderVersionInfo = () =>
    version && (
      <OverviewItem>
        <Icon name={'version'} />
        {`v${version}`}
      </OverviewItem>
    );

  const renderAuthorInfo = () =>
    authorName && (
      <Author>
        <Avatar alt={authorName} src={authorAvatar} />
        <Details>
          <Text text={authorName} />
        </Details>
      </Author>
    );

  const renderFileSize = () =>
    unpackedSize && (
      <OverviewItem>
        <Icon name={'fileBinary'} />
        {fileSizeSI(unpackedSize)}
      </OverviewItem>
    );

  const renderLicenseInfo = () =>
    license && (
      <OverviewItem>
        <Icon name={'law'} />
        {license}
      </OverviewItem>
    );

  const renderPublishedInfo = () =>
    time && (
      <OverviewItem>
        <Icon name={'time'} />
        <Published>{`Published on ${formatDate(time)} •`}</Published>
        {`${formatDateDistance(time)} ago`}
      </OverviewItem>
    );

  const renderHomePageLink = () =>
    homepage && (
      <a href={homepage} target={'_blank'}>
        <Tooltip aria-label={'Homepage'} title={'Visit homepage'}>
          <IconButton aria-label={'Homepage'}>
            {/* eslint-disable-next-line react/jsx-max-depth */}
            <HomeIcon />
          </IconButton>
        </Tooltip>
      </a>
    );

  const renderBugsLink = () =>
    url && (
      <a href={url} target={'_blank'}>
        <Tooltip aria-label={'Bugs'} title={'Open an issue'}>
          <IconButton aria-label={'Bugs'}>
            {/* eslint-disable-next-line react/jsx-max-depth */}
            <BugReport />
          </IconButton>
        </Tooltip>
      </a>
    );

  const renderPrimaryComponent = () => {
    return (
      <Grid container={true} item={true} xs={12}>
        <Grid item={true} xs={true}>
          <WrapperLink to={`/-/web/detail/${packageName}`}>
            {/* eslint-disable-next-line react/jsx-max-depth */}
            <PackageTitle>{packageName}</PackageTitle>
          </WrapperLink>
        </Grid>
        <GridRightAligned item={true} xs={true}>
          {renderHomePageLink()}
          {renderBugsLink()}
        </GridRightAligned>
      </Grid>
    );
  };

  const renderSecondaryComponent = () => {
    const tags = keywords.sort().map((keyword, index) => <Tag key={index}>{keyword}</Tag>);
    return (
      <>
        <Description component={'span'}>{description}</Description>
        {tags.length > 0 && <TagContainer>{tags}</TagContainer>}
      </>
    );
  };

  return (
    <PackageList>
      <ListItem alignItems={'flex-start'}>
        <PackageListItemText component={'div'} primary={renderPrimaryComponent()} secondary={renderSecondaryComponent()} />
      </ListItem>
      <PackageListItem alignItems={'flex-start'}>
        {renderAuthorInfo()}
        {renderVersionInfo()}
        {renderPublishedInfo()}
        {renderFileSize()}
        {renderLicenseInfo()}
      </PackageListItem>
    </PackageList>
  );
};
export default Package;
