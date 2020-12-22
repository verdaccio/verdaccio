import React from 'react';
import { useTranslation } from 'react-i18next';

import { SvgIcon } from '../SvgIcon';

type Props = React.ComponentProps<typeof SvgIcon>;

const Russia = React.forwardRef(function Russia(props: Props, ref: React.Ref<SVGSVGElement>) {
  const { t } = useTranslation();
  return (
    <SvgIcon viewBox="0 0 512 512" {...props} ref={ref} title={t('flag.russia')}>
      <path
        d="M473.655 88.276H38.345C17.167 88.276 0 105.443 0 126.621v73.471h512v-73.471c0-21.178-17.167-38.345-38.345-38.345z"
        fill="#f5f5f5"
      />
      <path d="M0 200.09h512V311.9H0z" fill="#0039a6" />
      <path
        d="M0 385.379c0 21.177 17.167 38.345 38.345 38.345h435.31c21.177 0 38.345-17.167 38.345-38.345v-73.471H0v73.471z"
        fill="#d52b1e"
      />
    </SvgIcon>
  );
});

Russia.displayName = 'Russia';

export { Russia };
