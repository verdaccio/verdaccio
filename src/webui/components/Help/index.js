import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import SyntaxHighlighter, {registerLanguage} from 'react-syntax-highlighter/dist/light';
import sunburst from 'react-syntax-highlighter/src/styles/sunburst';
import js from 'react-syntax-highlighter/dist/languages/javascript';

import classes from './help.scss';
import {getRegistryURL} from '../../utils/url';
import messages from './messages';

registerLanguage('javascript', js);

const Help = ({ intl: { formatMessage }}) => {
  const registryURL = getRegistryURL();

    return (
      <div className={classes.help}>
        <li className={classes.noPkg}>
          <h1 className={classes.noPkgTitle}>
            {formatMessage(messages.title)}
          </h1>
          <div className={classes.noPkgIntro}>
            <div>
              {formatMessage(messages.subTitle)}
            </div>
            <br/>
            <strong>{formatMessage(messages.firstStep)}</strong>
            <SyntaxHighlighter language='javascript' style={sunburst} id="adduser">
            {formatMessage(messages.npmRegistry, { command: formatMessage(messages.addUser), registryURL })}
            </SyntaxHighlighter>
            <strong>{formatMessage(messages.secondStep)}</strong>
            <SyntaxHighlighter language='javascript' style={sunburst} id="publish">
            {formatMessage(messages.npmRegistry, { command: formatMessage(messages.publish), registryURL })}
            </SyntaxHighlighter>
            <strong>{formatMessage(messages.thirdStep)}</strong>
          </div>
        </li>
      </div>
    );
};

Help.propTypes = {
  intl: intlShape
};

export default injectIntl(Help);
