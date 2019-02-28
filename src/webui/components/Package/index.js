/**
 * @prettier
 * @flow
 */

/* eslint-disable */

import React from 'react';
import type { Element } from 'react';
import { spacing } from '../../utils/styles/mixings';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar2 from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import BugReport from '@material-ui/icons/BugReport';
import Tooltip from '@material-ui/core/Tooltip';
import HomeIcon from '@material-ui/icons/Home';
import BookmarkBorder from '@material-ui/icons/BookmarkBorder';

import Tag from '../Tag';
import fileSizeSI from '../../utils/file-size';
import { formatDate, formatDateDistance } from '../../utils/package';

import { IProps } from './types';
import {
  WrapperLink,
  Header,
  MainInfo,
  Name,
  Version,
  Overview,
  Published,
  OverviewItem,
  Description,
  Icon,
  Text,
  Details,
  Avatar,
  Author,
  Field,
  Content,
  Footer,
  PackageName,
} from './styles';
import { fontWeight } from '../../utils/styles/sizes';

// const getInitialsName = (name: string) =>
//   name
//     .split(' ')
//     .reduce((accumulator, currentValue) => accumulator.charAt(0) + currentValue.charAt(0), '')
//     .toUpperCase();

const Package = ({
  name: label,
  version,
  dist: { unpackedSize } = {},
  time,
  author: { name, avatar },
  description,
  license,
  keywords = [],
  homepage,
  bugs,
}: IProps): Element<WrapperLink> => {
  console.log(homepage);
  const renderVersionInfo = () =>
    version && (
      <OverviewItem>
        <Icon name={'version'} />
        {`v${version}`}
      </OverviewItem>
    );

  const renderAuthorInfo = () => {
    return (
      <Author>
        <Avatar alt={name} src={avatar} style={{ width: '20px', height: '20px' }} />
        <Details>
          <Text text={name} />
        </Details>
      </Author>
    );
  }

  const renderFileSize = () =>
    unpackedSize && (
      <OverviewItem>
        <Icon name={'filebinary'} />
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

  const renderPublishedInfo = () => (
    <OverviewItem>
      <Icon name={'time'} />
      <Published modifiers={spacing('margin', '0px', '5px', '0px', '0px')}>{`Published on ${formatDate(time)} •`}</Published>
      {`${formatDateDistance(time)} ago`}
    </OverviewItem>
  );

  const renderDescription = () =>
    description && (
      <Field>
        <Description>{description}</Description>
      </Field>
    );

  // return (
  //   <WrapperLink className={'package'} to={`/-/web/detail/${label}`}>
  //     <Header>
  //       {renderMainInfo()}
  //       <Overview>
  //         {renderLicenseInfo()}
  //         {renderPublishedInfo()}
  //       </Overview>
  //     </Header>
  //     <Content>
  //       <Field>{renderAuthorInfo()}</Field>
  //       {renderDescription()}
  //     </Content>
  //     {keywords.length > 0 && (
  //       <Footer>
  //         {keywords.sort().map((keyword, index) => (
  //           <Tag key={index}>{keyword}</Tag>
  //         ))}
  //       </Footer>
  //     )}
  //   </WrapperLink>
  // );
  const tags = keywords.sort().map((keyword, index) => (
    <Tag style={{ color: '#485A3E' }} key={index}>
      {keyword}
    </Tag>
  ));

  const renderHomePageLink = () =>
    homepage && (
      <a href={homepage} target="_blank">
        <Tooltip title="Visit homepage" aria-label="Add">
          <IconButton aria-label="Report" style={{ padding: '6px' }}>
            <HomeIcon fontSize="small" style={{ fontSize: '16px' }} />
          </IconButton>
        </Tooltip>
      </a>
    );

  const renderBugsLink = () =>
    bugs &&
    bugs.url && (
      <a href={bugs.url} target="_blank">
        <Tooltip title="Open an issue" aria-label="Add">
          <IconButton aria-label="Report" style={{ padding: '6px' }}>
            <BugReport fontSize="small" style={{ fontSize: '16px' }} />
          </IconButton>
        </Tooltip>
      </a>
    );

  return (
    <List style={{ padding: '12px 0 12px 0' }}>
      <ListItem alignItems="flex-start">
        <ListItemText
          component="div"
          style={{ paddingRight: 0 }}
          primary={
            <Grid item xs={12} container>
              <Grid item xs>
                <WrapperLink to={`/-/web/detail/${label}`}>
                  <PackageName>{label}</PackageName>
                </WrapperLink>
              </Grid>
              <Grid item xs style={{ textAlign: 'right' }}>
                {renderHomePageLink()}
                {renderBugsLink()}
                {/* <Tooltip title="Pin it" aria-label="Add">
                    <IconButton aria-label="Report" style={{ padding: '6px' }}>
                      <BookmarkBorder fontSize="small" style={{ fontSize: '16px' }} />
                    </IconButton>
                  </Tooltip>           */}
              </Grid>
            </Grid>
          }
          secondary={
            <React.Fragment>
              <Typography component="span" style={{ color: '#586069', fontSize: '14px', paddingRight: 0 }}>
                {description}
              </Typography>
              {tags.length > 0 && <span style={{ marginTop: '8px', display: 'block' }}>{tags}</span>}
            </React.Fragment>
          }
        />
      </ListItem>
      <ListItem alignItems="flex-start">
        {renderAuthorInfo()}
        {renderVersionInfo()}
        {renderPublishedInfo()}
        {renderFileSize()}
        {renderLicenseInfo()}
      </ListItem>
    </List>
  );
};
export default Package;
