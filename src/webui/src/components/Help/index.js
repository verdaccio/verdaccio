
import React from 'react';
import SyntaxHighlighter, {registerLanguage} from 'react-syntax-highlighter/dist/light';
import sunburst from 'react-syntax-highlighter/src/styles/sunburst';
import js from 'react-syntax-highlighter/dist/languages/javascript';

import classes from './help.scss';

registerLanguage('javascript', js);

const Help = () => {
  // Don't add slash if it's not a sub directory
  const registryURL = `${location.origin}${location.pathname === '/' ? '' : location.pathname}`;

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
            <SyntaxHighlighter language='javascript' style={sunburst}>
              {`npm adduser --registry  ${registryURL}`}
            </SyntaxHighlighter>
            <strong>2. Publish</strong>
            <SyntaxHighlighter language='javascript' style={sunburst}>
              {`npm publish --registry ${registryURL}`}
            </SyntaxHighlighter>
            <strong>3. Refresh this page!</strong>
          </div>
        </li>
      </div>
    );
};

export default Help;
