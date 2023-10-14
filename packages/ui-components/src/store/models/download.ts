import { createModel } from '@rematch/core';

import type { RootModel } from '.';
import { downloadFile, extractFileName } from '../../utils/url';
import API from '../api';

/**
 *
 * @category Model
 */
export const download = createModel<RootModel>()({
  state: {},
  reducers: {},
  effects: () => ({
    async getTarball({ link }) {
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
