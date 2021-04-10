import React from 'react';
import { useTranslation } from 'react-i18next';

import { SvgIcon } from '../SvgIcon';

type Props = React.ComponentProps<typeof SvgIcon>;

const Spain = React.forwardRef(function Spain(props: Props, ref: React.Ref<SVGSVGElement>) {
  const { t } = useTranslation();
  return (
    <SvgIcon viewBox="0 0 45 45" {...props} ref={ref} title={t('flag.spain')}>
      <defs>
        <clipPath id="prefix__a">
          <path d="M0 36h36V0H0v36z" />
        </clipPath>
      </defs>
      <g clipPath="url(#prefix__a)" transform="matrix(1.25 0 0 -1.25 0 45)">
        <path
          d="M36 9a4 4 0 00-4-4H4a4 4 0 00-4 4v18a4 4 0 004 4h28a4 4 0 004-4V9z"
          fill="#c60a1d"
        />
        <path d="M36 12H0v12h36V12z" fill="#ffc400" />
        <path d="M9 19v-3a3 3 0 116 0v3H9z" fill="#ea596e" />
        <path d="M12 17h3v3h-3v-3z" fill="#f4a2b2" />
        <path d="M12 17H9v3h3v-3z" fill="#dd2e44" />
        <path
          d="M15 21.5c0-.829-1.343-1.5-3-1.5s-3 .671-3 1.5 1.343 1.5 3 1.5 3-.671 3-1.5"
          fill="#ea596e"
        />
        <path
          d="M15 22.25c0 .414-1.343.75-3 .75s-3-.336-3-.75 1.343-.75 3-.75 3 .336 3 .75"
          fill="#ffac33"
        />
        <path d="M7 13h1v7H7v-7zm10 0h-1v7h1v-7z" fill="#99aab5" />
        <path d="M9 13H6v1h3v-1zm9 0h-3v1h3v-1zM8 20H7v1h1v-1zm9 0h-1v1h1v-1z" fill="#66757f" />
      </g>
    </SvgIcon>
  );
});

Spain.displayName = 'Spain';

export { Spain };
