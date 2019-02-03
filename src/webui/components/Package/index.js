/**
 * @prettier
 * @flow
 */

import React from 'react';
import type { Element } from 'react';
import { spacing } from '../../utils/styles/mixings';

import Tag from '../Tag';
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
} from './styles';

const getInitialsName = (name: string) =>
  name
    .split(' ')
    .reduce((accumulator, currentValue) => accumulator.charAt(0) + currentValue.charAt(0), '')
    .toUpperCase();

const Package = ({ name: label, version, time, author: { name, avatar }, description, license, keywords = [] }: IProps): Element<WrapperLink> => {
  const renderMainInfo = () => (
    <MainInfo>
      <Name>{label}</Name>
      <Version>{`v${version}`}</Version>
    </MainInfo>
  );

  const renderAuthorInfo = () => (
    <Author>
      <Avatar alt={name} src={avatar}>
        {!avatar && getInitialsName(name)}
      </Avatar>
      <Details>
        <Text text={name} weight={'bold'} />
      </Details>
    </Author>
  );

  const renderLicenseInfo = () =>
    license && (
      <OverviewItem>
        <Icon modifiers={spacing('margin', '4px', '5px', '0px', '0px')} name={'license'} pointer={true} />
        {license}
      </OverviewItem>
    );

  const renderPublishedInfo = () => (
    <OverviewItem>
      <Icon name={'time'} pointer={true} />
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

  return (
    <WrapperLink className={'package'} to={`/-/web/version/${label}`}>
      <Header>
        {renderMainInfo()}
        <Overview>
          {renderLicenseInfo()}
          {renderPublishedInfo()}
        </Overview>
      </Header>
      <Content>
        <Field>{renderAuthorInfo()}</Field>
        {renderDescription()}
      </Content>
      {keywords.length > 0 && (
        <Footer>
          {keywords.sort().map((keyword, index) => (
            <Tag key={index}>{keyword}</Tag>
          ))}
        </Footer>
      )}
    </WrapperLink>
  );
};
export default Package;
