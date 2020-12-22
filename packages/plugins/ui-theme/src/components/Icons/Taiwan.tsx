import React from 'react';
import { useTranslation } from 'react-i18next';

import { SvgIcon } from '../SvgIcon';

type Props = React.ComponentProps<typeof SvgIcon>;

const Taiwan = React.forwardRef(function Taiwan(props: Props, ref: React.Ref<SVGSVGElement>) {
  const { t } = useTranslation();
  return (
    <SvgIcon viewBox="-60 -40 240 160" {...props} ref={ref} title={t('flag.taiwan')}>
      <rect x={-60} y={-40} width="100%" height="100%" fill="#fe0000" />
      <rect x={-60} y={-40} width="50%" height="50%" fill="#000095" />
      <path id="prefix__a" d="M8 0L0 30-8 0l8-30M0 8l30-8L0-8l-30 8" fill="#fff" />
      <use xlinkHref="#prefix__a" transform="rotate(30)" />
      <use xlinkHref="#prefix__a" transform="rotate(60)" />
      <circle r={17} fill="#000095" />
      <circle r={15} fill="#fff" />
    </SvgIcon>
  );
});

Taiwan.displayName = 'Taiwan';

export { Taiwan };
