import { createRemoteUser } from '@verdaccio/config';

import { signPayload, verifyPayload } from '../src';

describe('verifyJWTPayload', () => {
  test('should verify the token and return a remote user', async () => {
    const remoteUser = createRemoteUser('foo', []);
    const token = await signPayload(remoteUser, '12345');
    const verifiedToken = verifyPayload(token, '12345');
    expect(verifiedToken.groups).toEqual(remoteUser.groups);
    expect(verifiedToken.name).toEqual(remoteUser.name);
  });
});
