import nock from 'nock';

nock.disableNetConnect();
nock.enableNetConnect((host) => host.startsWith('127.0.0.1') || host.startsWith('localhost'));
