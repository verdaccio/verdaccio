import {getListListenAddresses} from "../src/cli-utils";
import _ from "lodash";
import {DEFAULT_DOMAIN, DEFAULT_PORT, DEFAULT_PROTOCOL} from "@verdaccio/dev-commons";

jest.mock('@verdaccio/logger', () => ({
	setup: jest.fn(),
	logger: {
		child: jest.fn(),
		debug: jest.fn(),
		trace: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
		fatal: jest.fn()
	}
}));

describe('getListListenAddresses test', () => {

	test('should return no address if a single address is wrong', () => {
		// @ts-ignore
		const addrs = getListListenAddresses("wrong");

		expect(_.isArray(addrs)).toBeTruthy();
		expect(addrs).toHaveLength(0);
	});

	test('should return no address if a two address are wrong', () => {
		// @ts-ignore
		const addrs = getListListenAddresses(["wrong", "same-wrong"]);

		expect(_.isArray(addrs)).toBeTruthy();
		expect(addrs).toHaveLength(0);
	});

	test('should return a list of 1 address provided', () => {
		// @ts-ignore
		const addrs = getListListenAddresses(null, '1000');

		expect(_.isArray(addrs)).toBeTruthy();
		expect(addrs).toHaveLength(1);
	});

	test('should return a list of 2 address provided', () => {
		// @ts-ignore
		const addrs = getListListenAddresses(null, ['1000', '2000']);

		expect(_.isArray(addrs)).toBeTruthy();
		expect(addrs).toHaveLength(2);
	});

	test(`should return by default ${DEFAULT_PORT}`, () => {
		// @ts-ignore
		const [addrs] = getListListenAddresses();

		// @ts-ignore
		expect(addrs.proto).toBe(DEFAULT_PROTOCOL);
		// @ts-ignore
		expect(addrs.host).toBe(DEFAULT_DOMAIN);
		// @ts-ignore
		expect(addrs.port).toBe(DEFAULT_PORT);
	});

	test('should return default proto, host and custom port', () => {
		const initPort = '1000';
		// @ts-ignore
		const [addrs] = getListListenAddresses(null, initPort);

		// @ts-ignore
		expect(addrs.proto).toEqual(DEFAULT_PROTOCOL);
		// @ts-ignore
		expect(addrs.host).toEqual(DEFAULT_DOMAIN);
		// @ts-ignore
		expect(addrs.port).toEqual(initPort);
	});

});
