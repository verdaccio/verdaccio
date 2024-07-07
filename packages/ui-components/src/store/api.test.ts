import api, { handleResponseType } from './api';

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

      expect(handled[0]).toBeFalsy();
      expect(handled[1]).toBeDefined();
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

    test('should test pdf scenario', async () => {
      const blob = new Blob(['foo']);
      const blobPromise = Promise.resolve<Blob>(blob);
      const response: Response = {
        url: 'http://localhost:8080/test.pdf',
        blob: () => blobPromise,
        ok: true,
        headers: new Headers({
          'Content-Type': 'application/pdf',
        }),
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

      const response = await api.request('https://verdaccio.tld/resource');

      expect(fetchSpy).toHaveBeenCalledWith('https://verdaccio.tld/resource', {
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

      const api = require('./api').default;
      const response = await api.request('https://verdaccio.tld/resource', 'GET');

      expect(fetchSpy).toHaveBeenCalledWith('https://verdaccio.tld/resource', {
        credentials: 'same-origin',
        headers: new Headers({
          Authorization: 'Bearer token-xx-xx-xx',
          'x-client': 'verdaccio-ui',
        }),
        method: 'GET',
      });
      expect(response).toEqual({ c: 3 });
    });

    test('when url is a cross origin url', async () => {
      fetchSpy.mockImplementation(() =>
        Promise.resolve({
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          ok: true,
          json: () => ({ b: 2 }),
        })
      );

      const response = await api.request('https://verdaccio.xyz/resource');
      expect(fetchSpy).toHaveBeenCalledWith('https://verdaccio.xyz/resource', {
        credentials: 'same-origin',
        headers: {},
        method: 'GET',
      });
      expect(response).toEqual({ b: 2 });
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

      await expect(api.request('/resource')).rejects.toThrow(new Error('Unknown error'));
    });

    test('when api returns an error 5.x.x', async () => {
      const errorMessage = 'Internal server error';
      fetchSpy.mockImplementation(() => Promise.reject(new Error(errorMessage)));

      await expect(api.request('/resource')).rejects.toThrow(new Error(errorMessage));
    });
  });
});
