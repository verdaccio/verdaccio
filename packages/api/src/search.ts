import { HTTP_STATUS } from '@verdaccio/core';
import { SEARCH_API_ENDPOINTS } from '@verdaccio/middleware';
import { Logger } from '@verdaccio/types';

export default function (route, logger: Logger): void {
  // TODO: next major version, remove this
  route.get(SEARCH_API_ENDPOINTS.deprecated_search, function (_req, res) {
    logger.warn('search endpoint has been removed, please use search v1');
    res.status(HTTP_STATUS.NOT_FOUND);
    res.json({ error: 'not found, endpoint was removed' });
  });
}
