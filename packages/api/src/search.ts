import { HTTP_STATUS } from '@verdaccio/core';
import { logger } from '@verdaccio/logger';

export default function (route): void {
  // TODO: next major version, remove this
  route.get('/-/all(/since)?', function (_req, res) {
    logger.warn('search endpoint has been removed, please use search v1');
    res.status(HTTP_STATUS.NOT_FOUND);
    res.json({ error: 'not found, endpoint was removed' });
  });
}
