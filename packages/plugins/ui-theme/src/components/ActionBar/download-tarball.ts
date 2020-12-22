import api from 'verdaccio-ui/utils/api';
import { extractFileName, downloadFile } from 'verdaccio-ui/utils/url';

function downloadTarball(link: string) {
  return async function downloadHandler(): Promise<void> {
    const fileStream: Blob = await api.request(link, 'GET', {
      headers: {
        ['accept']:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
      },
      credentials: 'include',
    });
    const fileName = extractFileName(link);
    downloadFile(fileStream, fileName);
  };
}

export default downloadTarball;
