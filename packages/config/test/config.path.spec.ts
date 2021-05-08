import { findConfigFile } from '../src/config-path';

const mockmkDir = jest.fn();
const mockwriteFile = jest.fn();

jest.mock('fs', () => {
  const fsOri = jest.requireActual('fs');
  return {
    ...fsOri,
    statSync: (path) => ({
      isDirectory: () => !path.match(/fail/),
    }),
    mkdirSync: (a) => mockmkDir(a),
    writeFileSync: (a) => mockwriteFile(a),
  };
});

jest.mock('fs');

describe('config-path', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('findConfigFile', () => {
    test('with custom location', () => {
      expect(findConfigFile('/home/user/custom/location/config.yaml')).toEqual(
        '/home/user/custom/location/config.yaml'
      );
      expect(mockwriteFile).not.toHaveBeenCalled();
      expect(mockmkDir).not.toHaveBeenCalled();
    });

    test('with XDG_CONFIG_HOME if directory exist but config file is missing', () => {
      process.env.XDG_CONFIG_HOME = '/home/user';
      expect(findConfigFile()).toEqual('/home/user/verdaccio/config.yaml');
      expect(mockwriteFile).toHaveBeenCalledWith('/home/user/verdaccio/config.yaml');
      expect(mockmkDir).toHaveBeenCalledWith('/home/user/verdaccio');
    });

    test('with HOME if directory exist but config file is missing', () => {
      delete process.env.XDG_CONFIG_HOME;
      process.env.HOME = '/home/user';
      expect(findConfigFile()).toEqual('/home/user/.config/verdaccio/config.yaml');
      expect(mockwriteFile).toHaveBeenCalledWith('/home/user/.config/verdaccio/config.yaml');
      expect(mockmkDir).toHaveBeenCalledWith('/home/user/.config/verdaccio');
    });

    test('with windows as directory exist but config file is missing', () => {
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', {
        value: 'win32',
      });
      delete process.env.XDG_CONFIG_HOME;
      delete process.env.HOME;
      process.env.APPDATA = '/app/data/';
      expect(findConfigFile()).toEqual('/app/data/verdaccio/config.yaml');
      expect(mockwriteFile).toHaveBeenCalledWith('/app/data/verdaccio/config.yaml');
      expect(mockmkDir).toHaveBeenCalledWith('/app/data/verdaccio');
      Object.defineProperty(process, 'platform', {
        value: originalPlatform,
      });
    });

    test('with relative location', () => {
      delete process.env.XDG_CONFIG_HOME;
      delete process.env.HOME;
      process.env.APPDATA = '/app/data/';
      expect(findConfigFile()).toMatch('projects/verdaccio/packages/config/verdaccio/config.yaml');
      expect(mockwriteFile).toHaveBeenCalled();
      expect(mockmkDir).toHaveBeenCalled();
    });
  });
});
