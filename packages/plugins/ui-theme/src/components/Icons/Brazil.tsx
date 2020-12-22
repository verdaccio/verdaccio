import React from 'react';
import { useTranslation } from 'react-i18next';

import { SvgIcon } from '../SvgIcon';

type Props = React.ComponentProps<typeof SvgIcon>;

const Brazil = React.forwardRef(function Brazil(props: Props, ref: React.Ref<SVGSVGElement>) {
  const { t } = useTranslation();
  return (
    <SvgIcon viewBox="0 0 45 45" {...props} ref={ref} title={t('flag.brazil')}>
      <defs>
        <clipPath id="prefix__a">
          <path d="M0 36h36V0H0v36z" />
        </clipPath>
      </defs>
      <g clipPath="url(#prefix__a)" transform="matrix(1.25 0 0 -1.25 0 45)">
        <path
          d="M36 9a4 4 0 00-4-4H4a4 4 0 00-4 4v18a4 4 0 004 4h28a4 4 0 004-4V9z"
          fill="#009b3a"
        />
        <path d="M32.727 18L18 6.876 3.27 18 18 29.125 32.727 18z" fill="#fedf01" />
        <path
          d="M24.434 18.076a6.458 6.458 0 11-12.917 0 6.458 6.458 0 0112.917 0"
          fill="#002776"
        />
        <path
          d="M12.277 21.113a6.406 6.406 0 01-.672-2.023c3.994.29 9.417-1.892 11.744-4.596.402.604.7 1.28.882 2.004-2.871 2.809-7.916 4.63-11.954 4.615"
          fill="#cbe9d4"
        />
        <path d="M13 16.767h-1v1h1v-1zm1-2h-1v1h1v-1z" fill="#88c9f9" />
        <path
          d="M16 16.767h-1v1h1v-1zm2-1h-1v1h1v-1zm4-2h-1v1h1v-1zm-3-1h-1v1h1v-1zm3 6h-1v1h1v-1z"
          fill="#55acee"
        />
        <path d="M20 14.767h-1v1h1v-1z" fill="#3b88c3" />
      </g>
    </SvgIcon>
  );
});

Brazil.displayName = 'Brazil';

export { Brazil };
