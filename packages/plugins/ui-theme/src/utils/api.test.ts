import api, { handleResponseType } from '../../src/utils/api';

describe('api', () => {
  describe('handleResponseType', () => {
    test('should handle missing Content-Type', async () => {
      const responseText = `responseText`;
      const ok = false;
      const response: Response = {
        url: 'http://localhost:8080/-/packages',
        ok,
        headers: new Headers(),
        text: async () => responseText,
      } as Response;

      const handled = await handleResponseType(response);

      expect(handled).toEqual([ok, responseText]);
    });

    test('should test tgz scenario', async () => {
      const blob = new Blob(['foo']);
      const blobPromise = Promise.resolve<Blob>(blob);
      const response: Response = {
        url: 'http://localhost:8080/bootstrap/-/bootstrap-4.3.1.tgz',
        blob: () => blobPromise,
        ok: true,
        headers: new Headers(),
      } as Response;
      const handled = await handleResponseType(response);

      expect(handled).toEqual([true, blob]);
    });
  });

  describe('api client', () => {
    let fetchSpy: jest.SpyInstance;

    beforeEach(() => {
      fetchSpy = jest.spyOn(window, 'fetch');
    });

    afterEach(() => {
      fetchSpy.mockRestore();
    });

    test('when url is a resource url', async () => {
      fetchSpy.mockImplementation(() =>
        Promise.resolve({
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          ok: true,
          json: () => ({ a: 1 }),
        })
      );

      const response = await api.request('resource');

      expect(fetchSpy).toHaveBeenCalledWith('/-/verdaccio/resource', {
        credentials: 'same-origin',
        headers: {},
        method: 'GET',
      });
      expect(response).toEqual({ a: 1 });
    });

    test('when there is token from storage', async () => {
      jest.resetModules();
      jest.doMock('./storage', () => ({ getItem: () => 'token-xx-xx-xx' }));

      fetchSpy.mockImplementation(() =>
        Promise.resolve({
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          ok: true,
          json: () => ({ c: 3 }),
        })
      );

      const api = require('../../src/utils/api').default;
      const response = await api.request('resource', 'GET');

      expect(fetchSpy).toHaveBeenCalledWith('/-/verdaccio/resource', {
        credentials: 'same-origin',
        headers: new Headers({
          Authorization: 'Bearer token-xx-xx-xx',
        }),
        method: 'GET',
      });
      expect(response).toEqual({ c: 3 });
    });

    test('when api returns an error 3.x.x - 4.x.x', async () => {
      fetchSpy.mockImplementation(() =>
        Promise.resolve({
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          ok: false,
          json: () => {},
        })
      );

      await expect(api.request('resource')).rejects.toThrow(new Error('something went wrong'));
    });

    test('when api returns an error 5.x.x', async () => {
      const errorMessage = 'Internal server error';
      fetchSpy.mockImplementation(() => Promise.reject(new Error(errorMessage)));

      await expect(api.request('resource')).rejects.toThrow(new Error(errorMessage));
    });
  });
});
