/**
 * @prettier
 */
import { addVersion, uploadPackageTarball } from '../../../src/api/endpoint/api/publish';
import { HTTP_STATUS } from '../../../src/lib/constants';

/**
 * Logger Service
 */
const logger = {
  logger: {
    error: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
  },
};
jest.doMock('../../../src/lib/logger', () => logger);

describe('Publish endpoints - add a tag', () => {
  const req = {
    params: {
      version: '1.0.0',
      tag: 'tag',
      package: 'verdaccio',
    },
    body: '',
  };
  const res = {
    status: jest.fn(),
  };

  const next = jest.fn();

  test('should add a version', done => {
    const storage = {
      addVersion: (packageName, version, body, tag, cb) => {
        expect(packageName).toEqual(req.params.package);
        expect(version).toEqual(req.params.version);
        expect(body).toEqual(req.body);
        expect(tag).toEqual(req.params.tag);
        cb();
        done();
      },
    };

    addVersion(storage)(req, res, next);

    expect(res.status).toHaveBeenLastCalledWith(HTTP_STATUS.CREATED);
    expect(next).toHaveBeenLastCalledWith({ ok: 'package published' });
  });

  test('when failed to add a version', done => {
    const storage = {
      addVersion: (packageName, version, body, tag, cb) => {
        const error = {
          message: 'failure',
        };
        cb(error);
        done();
      },
    };

    addVersion(storage)(req, res, next);

    expect(next).toHaveBeenLastCalledWith({ message: 'failure' });
  });
});

/**
 * Todo: Improve stream tests
 */
describe('Publish endpoints - upload package tarball', () => {
  const req = {
    params: {
      filename: 'verdaccio.gzip',
      package: 'verdaccio',
    },
    pipe: jest.fn(),
    on: jest.fn(),
  };
  const res = { status: jest.fn(), report_error: jest.fn() };
  const next = jest.fn();

  test('should upload package tarball successfully', () => {
    const stream = {
      done: jest.fn(),
      abort: jest.fn(),
      on: jest.fn(() => (status, cb) => cb()),
    };
    const storage = {
      addTarball(packageName, filename) {
        expect(packageName).toEqual(req.params.package);
        expect(filename).toEqual(req.params.filename);
        return stream;
      },
    };

    uploadPackageTarball(storage)(req, res, next);
    expect(req.pipe).toHaveBeenCalled();
    expect(req.on).toHaveBeenCalled();
  });
});
