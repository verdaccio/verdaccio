import React from 'react';

import { SvgIcon } from '../SvgIcon';

type Props = React.ComponentProps<typeof SvgIcon>;

const Version = React.forwardRef(function Version(props: Props, ref: React.Ref<SVGSVGElement>) {
  return (
    <SvgIcon viewBox="0 0 14 16" height={16} width={14} {...props} ref={ref}>
      <path
        fillRule="evenodd"
        d="M13 3H7c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zm-1 8H8V5h4v6zM4 4h1v1H4v6h1v1H4c-.55 0-1-.45-1-1V5c0-.55.45-1 1-1zM1 5h1v1H1v4h1v1H1c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1z"
      />
    </SvgIcon>
  );
});

Version.displayName = 'Version';

export { Version };
