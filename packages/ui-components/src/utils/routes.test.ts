import { describe, expect, test } from 'vitest';

import { APIRoute, Route } from './routes';

describe('stage routes', () => {
  test('should expose the staged packages UI routes', () => {
    expect(Route.STAGE).toBe('/-/web/stage');
    expect(Route.STAGE_DETAIL).toBe('/-/web/stage/:stageId');
  });

  test('should expose the staged packages API route', () => {
    expect(APIRoute.STAGE).toBe('/-/stage');
  });
});
