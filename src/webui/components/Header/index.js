import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'element-react';
import capitalize from 'lodash/capitalize';
import {getRegistryURL} from '../../utils/url';
import classes from './header.scss';
import './logo.png';

const Header = ({
  logo = '',
  scope = '',
  username = '',
  handleLogout = () => {},
  toggleLoginModal = () => {}
}) => {
  const registryUrl = getRegistryURL();
  return (
    <header className={classes.header}>
      <div className={classes.headerWrap}>
        <a href="{registryUrl}/#/">
          <img src={logo} className={classes.logo} />
        </a>
        <figure>
          npm set {scope}
          registry {registryUrl}
          <br />
          npm adduser --registry {registryUrl}
        </figure>

        <div className={classes.headerRight}>
          {username ? (
            <div className="user-logged">
              <span
                className={`user-logged-greetings ${classes.usernameField}`}
              >
                Hi, {capitalize(username)}
              </span>
              <Button
                className={`${classes.headerButton} header-button-logout`}
                type="danger"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              className={`${classes.headerButton} header-button-login`}
              onClick={toggleLoginModal}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  logo: PropTypes.string,
  scope: PropTypes.string,
  username: PropTypes.string,
  handleLogout: PropTypes.func.isRequired,
  toggleLoginModal: PropTypes.func.isRequired
};

export default Header;
