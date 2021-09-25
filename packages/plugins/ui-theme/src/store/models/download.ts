import { createModel } from '@rematch/core';

import API from '../../providers/API/api';
import { downloadFile, extractFileName } from '../../utils/url';

import type { RootModel } from '.';

export const download = createModel<RootModel>()({
  state: {},
  reducers: {},
  effects: () => ({
    async getTarball({ link }) {
      // const basePath = state.configuration.config.base;
      try {
        const fileStream: Blob = await API.request(link, 'GET', {
          headers: {
            ['accept']:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
          },
          credentials: 'include',
        });
        const fileName = extractFileName(link);
        downloadFile(fileStream, fileName);
      } catch (error: any) {
        // TODO: handle better error
        // eslint-disable-next-line no-console
        console.error('error on download', error);
      }
    },
  }),
});
