/**
 * @prettier
 */

import React from 'react';
import { withRouter } from 'react-router-dom';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth/index';
import ListItem from '@material-ui/core/ListItem/index';
import Typography from '@material-ui/core/Typography/index';
import { Wrapper, Inner, EmptyPackage, Heading, Card, List } from './styles';
import PackageImg from './img/package.svg';

// eslint-disable-next-line react/prop-types
const NotFound = ({ history, width }) => {
  const handleGoTo = to => () => {
    history.push(to);
  };

  const handleGoBack = () => () => {
    history.goBack();
  };

  const renderList = () => (
    <List>
      <ListItem button={true} divider={true} onClick={handleGoTo('/')}>
        {'Home'}
      </ListItem>
      <ListItem button={true} divider={true} onClick={handleGoBack()}>
        {'Back'}
      </ListItem>
    </List>
  );

  const renderSubTitle = () => (
    <Typography variant={'subtitle1'}>
      <div>{"The page you're looking for doesn't exist."}</div>
      <div>{'Perhaps these links will help find what you are looking for:'}</div>
    </Typography>
  );

  return (
    <Wrapper>
      <Inner>
        <EmptyPackage alt={'404 - Page not found'} src={PackageImg} />
        <Heading variant={isWidthUp('sm', width) ? 'h2' : 'h4'}>{"Sorry, we couldn't find it..."}</Heading>
        {renderSubTitle()}
        <Card>{renderList()}</Card>
      </Inner>
    </Wrapper>
  );
};

export default withRouter(withWidth()(NotFound));
