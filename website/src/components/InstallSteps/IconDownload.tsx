/* eslint-disable verdaccio/jsx-spread */
import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

const IconDownload = (props: any) => {
  return (
    <SvgIcon {...props}>
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
    </SvgIcon>
  );
};

IconDownload.muiName = 'SvgIcon';

export default IconDownload;
