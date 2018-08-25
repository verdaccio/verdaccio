import logo from '../../../../src/webui/utils/logo';

jest.mock('../../../../src/webui/utils/api', () => ({
  request: require('../components/__mocks__/api').default.request
}));

describe('logo', () => {
  it('loadLogo - should load verdaccio logo', async () => {
    const url = await logo();
    expect(url).toEqual('http://localhost/-/static/logo.png');
  });
});
