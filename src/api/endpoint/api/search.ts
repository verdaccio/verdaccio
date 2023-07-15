import { HTTP_STATUS } from '../../../lib/constants';
import { logger } from '../../../lib/logger';

export default function (route): void {
  // searching packages
  route.get('/-/all(/since)?', function (_req, res) {
    logger.warn('search endpoint has been removed, please use search v1');
    res.status(HTTP_STATUS.NOT_FOUND);
    res.json({ error: 'not found, endpoint removed' });
  });
}
