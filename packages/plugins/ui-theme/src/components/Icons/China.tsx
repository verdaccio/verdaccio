import React from 'react';
import { useTranslation } from 'react-i18next';

import { SvgIcon } from '../SvgIcon';

type Props = React.ComponentProps<typeof SvgIcon>;

const China = React.forwardRef(function China(props: Props, ref: React.Ref<SVGSVGElement>) {
  const { t } = useTranslation();
  return (
    <SvgIcon viewBox="0 0 45 45" {...props} ref={ref} title={t('flag.china')}>
      <defs>
        <clipPath id="prefix__a">
          <path d="M0 36h36V0H0v36z" />
        </clipPath>
      </defs>
      <g clipPath="url(#prefix__a)" transform="matrix(1.25 0 0 -1.25 0 45)">
        <path
          d="M36 9a4 4 0 00-4-4H4a4 4 0 00-4 4v18a4 4 0 004 4h28a4 4 0 004-4V9z"
          fill="#de2910"
        />
        <path
          d="M7 25.049l.929-2.67 2.826-.06-2.253-1.706.819-2.707L7 19.52l-2.321-1.615.819 2.707-2.253 1.707 2.826.059.929 2.67zm6 3.423l.34-.688.759-.11-.549-.536.129-.756-.679.357-.679-.357.13.756-.55.536.76.11.339.688zm2-4l.34-.688.759-.11-.549-.536.129-.756-.679.357-.679-.357.13.756-.55.536.76.11.339.688zm0-4l.34-.688.759-.11-.549-.536.129-.756-.679.357-.679-.357.13.756-.55.536.76.11.339.688zm-2-3.999l.34-.69.759-.11-.549-.534.129-.757-.679.357-.679-.357.13.757-.55.535.76.11.339.689z"
          fill="#ffde02"
        />
      </g>
    </SvgIcon>
  );
});

China.displayName = 'China';

export { China };
