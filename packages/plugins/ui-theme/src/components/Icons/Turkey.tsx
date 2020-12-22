import React from 'react';
import { useTranslation } from 'react-i18next';

import { SvgIcon } from '../SvgIcon';

type Props = React.ComponentProps<typeof SvgIcon>;

const Turkey = React.forwardRef(function Turkey(props: Props, ref: React.Ref<SVGSVGElement>) {
  const { t } = useTranslation();
  return (
    <SvgIcon viewBox="0 0 512 512" {...props} ref={ref} title={t('flag.turkey')}>
      <path fill="#d80027" d="M0 85.337h512v341.326H0z" />
      <g fill="#f0f0f0">
        <path d="M247.213 216.787l17.594 24.246 28.493-9.239-17.621 24.224 17.592 24.244-28.484-9.274-17.621 24.225.018-29.955-28.484-9.275 28.494-9.239z" />
        <path d="M199.202 316.602c-33.469 0-60.602-27.133-60.602-60.602s27.133-60.602 60.602-60.602c10.436 0 20.254 2.639 28.827 7.284-13.448-13.152-31.84-21.269-52.135-21.269-41.193 0-74.586 33.394-74.586 74.586s33.394 74.586 74.586 74.586c20.295 0 38.687-8.117 52.135-21.269-8.572 4.647-18.391 7.286-28.827 7.286z" />
      </g>
    </SvgIcon>
  );
});

Turkey.displayName = 'Turkey';

export { Turkey };
