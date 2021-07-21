import React, { useState } from 'react';
import clsx from 'clsx';
import copy from 'copy-text-to-clipboard';
import Translate, { translate } from '@docusaurus/Translate';

import styles from './Command.module.scss';

type CommandWithLogoProps = {
  image?: string;
  command: string;
  alt?: string;
};
const CommandWithLogo = ({ image, command, alt }: CommandWithLogoProps): React.ReactElement => {
  const [copied, setShowCopied] = useState(false);

  const handleCopyCode = () => {
    if (command) {
      copy(command);
    }
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <div className={clsx(styles.logoCommand, image && styles['logoCommand--withImage'])}>
      {image && <img loading="lazy" src={image} alt={alt} />}
      <code className="code-text">{command}</code>

      <button
        className={styles.copyButton}
        type="button"
        aria-label={translate({
          message: 'Copy code to clipboard',
        })}
        onClick={handleCopyCode}
      >
        {copied ? <Translate>Copied</Translate> : <Translate>Copy</Translate>}
      </button>
    </div>
  );
};

export default CommandWithLogo;
