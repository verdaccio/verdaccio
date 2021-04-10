import React from 'react';
import { useTranslation } from 'react-i18next';

import { SvgIcon } from '../SvgIcon';

type Props = React.ComponentProps<typeof SvgIcon>;

const Czech = React.forwardRef(function Czech(props: Props, ref: React.Ref<SVGSVGElement>) {
  const { t } = useTranslation();
  return (
    <SvgIcon viewBox="0 0 45 45" {...props} ref={ref} title={t('flag.czech')}>
      <path fill="#d7141a" d="M0 22.5h45v16H0z" />
      <path fill="#fff" d="M0 6.5h45v16H0z" />
      <path d="M22.5 22.5L0 6.5v32z" fill="#11457e" />
    </SvgIcon>
  );
});

Czech.displayName = 'Czech';

export { Czech };
