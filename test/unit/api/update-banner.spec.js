// @prettier
// @flow
import { 
    createBanner, 
    createErrorBanner
} from '../../../src/lib/update-banner';

import {HTTP_STATUS, API_ERROR} from '../../../src/lib/constants';

jest.resetModules();
jest.doMock('request', () => (url: string, resolver: Function) => {
    const response = {
        body: JSON.stringify({version: '4.5.6' }),
        statusCode: HTTP_STATUS.OK
    }
    resolver(null, response);
});

const banner = require('../../../src/lib/update-banner');

describe('Verdaccio update banner', () => {
    let log;

    beforeEach(() => {
        // mocking global console.log method
        global.console.log = jest.fn();
        log = global.console.log
    });

    test('should print major update banner', () => {
        banner.verdaccioUpdateBanner('3.0.0');
        expect(log).toMatchSnapshot();
    });

    test('should print minor update banner', () => {
        banner.verdaccioUpdateBanner('4.0.0');
        expect(log).toMatchSnapshot();
    });

    test('should print patch update banner', () => {
        banner.verdaccioUpdateBanner('4.5.0');
        expect(log).toMatchSnapshot();
    });

    test('when local version is equals to npm version', () => {
        banner.verdaccioUpdateBanner('4.5.6');
        expect(log).not.toHaveBeenCalledWith();
    });

    test('when local version is greater than npm version', () => {
        banner.verdaccioUpdateBanner('4.5.7');
        expect(log).not.toHaveBeenCalledWith();
    });

    test('when default registry returns with error', () => {
        jest.resetModules();
        jest.doMock('request', () => (url: string, resolver: Function) => {
            const error = {
                message: API_ERROR.INTERNAL_SERVER_ERROR,
                statusCode: HTTP_STATUS.INTERNAL_ERROR
            }
            resolver(error, null);
        });
        const banner = require('../../../src/lib/update-banner');
        banner.verdaccioUpdateBanner('4.5.7');
        expect(log).toMatchSnapshot();
    })

});

describe('createErrorBanner', () => {
    test('should create an error banner', () => {
        expect(createErrorBanner('message')).toMatchSnapshot();
    });
});

describe('create banner', () => {
    test('should create a major update banner', () => {
        expect(createBanner('1.0.0', '2.0.0', 'major')).toMatchSnapshot(); 
    });
    test('should create a minor update banner', () => {
        expect(createBanner('1.0.0', '1.1.0', 'minor')).toMatchSnapshot();
    });
    test('should create a patch update banner', () => {
        expect(createBanner('1.0.0', '1.0.1', 'patch')).toMatchSnapshot();
    });
});
