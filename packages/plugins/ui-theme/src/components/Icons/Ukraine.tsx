import React from 'react';
import { useTranslation } from 'react-i18next';

import { SvgIcon } from '../SvgIcon';

type Props = React.ComponentProps<typeof SvgIcon>;

const Ukraine = React.forwardRef(function Ukraine(props: Props, ref: React.Ref<SVGSVGElement>) {
  const { t } = useTranslation();
  return (
    <SvgIcon viewBox="0 0 512 512" {...props} ref={ref} title={t('flag.ukraine')}>
      <path
        d="M0 248v121.6C0 396.8 21.6 416 48 416h400c26.4 0 48-19.2 48-46.4V248H0z"
        fill="#fdce0c"
      />
      <path d="M248 248l197.6 168c26.4 0 50.4-19.2 50.4-46.4V248H248z" fill="#f4ba00" />
      <path
        d="M448 80H48C21.6 80 0 99.2 0 126.4V248h496V126.4c0-27.2-21.6-46.4-48-46.4z"
        fill="#44c1ef"
      />
      <path d="M448 80H48l200 168h248V126.4c0-27.2-21.6-46.4-48-46.4z" fill="#18b4ea" />
      <path d="M496 368.8c0 29.6-21.6 47.2-48 47.2H48c-26.4 0-48-20.8-48-48" fill="#f2a700" />
      <path d="M48 80h400c26.4 0 48 19.2 48 46.4V216" fill="#10a2e2" />
    </SvgIcon>
  );
});

Ukraine.displayName = 'Ukraine';

export { Ukraine };
