import React from 'react';
import CopyToClipBoard from '../CopyToClipBoard/index';

import classes from './help.scss';
import {getRegistryURL} from '../../utils/url';

const Help = () => {
  const registryUrl = getRegistryURL();

    return (
      <div className={classes.help}>
        <li className={classes.noPkg}>
          <h1 className={classes.noPkgTitle}>
            No Package Published Yet
          </h1>
          <div className={classes.noPkgIntro}>
            <div>
              To publish your first package just:
            </div>
            <br/>
            <strong>
              1. Login
            </strong>
            
            <CopyToClipBoard text={`npm set registry ${registryUrl}`} />
        
            <strong>2. Publish</strong>
            
              <CopyToClipBoard text={`npm adduser --registry ${registryUrl}`} />

            <strong>3. Refresh this page!</strong>
          </div>
        </li>
      </div>
    );
};

export default Help;

 