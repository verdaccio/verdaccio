import { describe, expect, test } from 'vitest';

import { ipUtils } from '../src';

describe('ip-utils', () => {
  describe('normalizeAddress', () => {
    test('returns undefined for empty input', () => {
      expect(ipUtils.normalizeAddress(undefined)).toBeUndefined();
      expect(ipUtils.normalizeAddress('')).toBeUndefined();
    });

    test('trims surrounding whitespace', () => {
      expect(ipUtils.normalizeAddress('  10.0.0.1  ')).toEqual('10.0.0.1');
    });

    test('strips the IPv4-mapped IPv6 prefix', () => {
      expect(ipUtils.normalizeAddress('::ffff:127.0.0.1')).toEqual('127.0.0.1');
    });

    test('leaves plain IPv6 untouched', () => {
      expect(ipUtils.normalizeAddress('2001:db8::1')).toEqual('2001:db8::1');
    });
  });

  describe('parseIPv4', () => {
    test('converts a dotted-quad to its unsigned 32-bit value', () => {
      expect(ipUtils.parseIPv4('0.0.0.0')).toEqual(0);
      expect(ipUtils.parseIPv4('255.255.255.255')).toEqual(0xffffffff);
      expect(ipUtils.parseIPv4('192.168.0.1')).toEqual(0xc0a80001);
    });

    test('returns undefined for non-IPv4 input', () => {
      expect(ipUtils.parseIPv4('2001:db8::1')).toBeUndefined();
      expect(ipUtils.parseIPv4('not-an-ip')).toBeUndefined();
    });
  });

  describe('isIPv4InCIDR', () => {
    test('matches addresses inside the range', () => {
      expect(ipUtils.isIPv4InCIDR('203.0.113.5', '203.0.113.0', 24)).toBe(true);
      expect(ipUtils.isIPv4InCIDR('10.1.2.3', '10.0.0.0', 8)).toBe(true);
    });

    test('rejects addresses outside the range', () => {
      expect(ipUtils.isIPv4InCIDR('203.0.114.5', '203.0.113.0', 24)).toBe(false);
    });

    test('treats /0 as matching everything', () => {
      expect(ipUtils.isIPv4InCIDR('8.8.8.8', '0.0.0.0', 0)).toBe(true);
    });

    test('rejects invalid prefixes or addresses', () => {
      expect(ipUtils.isIPv4InCIDR('10.0.0.1', '10.0.0.0', -1)).toBe(false);
      expect(ipUtils.isIPv4InCIDR('10.0.0.1', '10.0.0.0', 33)).toBe(false);
      expect(ipUtils.isIPv4InCIDR('not-an-ip', '10.0.0.0', 8)).toBe(false);
    });
  });

  describe('isAddressAllowed', () => {
    test('allows any address when the whitelist is empty or missing', () => {
      expect(ipUtils.isAddressAllowed('203.0.113.5', undefined)).toBe(true);
      expect(ipUtils.isAddressAllowed('203.0.113.5', [])).toBe(true);
    });

    test('rejects a missing address against a non-empty whitelist', () => {
      expect(ipUtils.isAddressAllowed(undefined, ['203.0.113.0/24'])).toBe(false);
    });

    test('honors an IPv4 CIDR whitelist', () => {
      expect(ipUtils.isAddressAllowed('203.0.113.5', ['203.0.113.0/24'])).toBe(true);
      expect(ipUtils.isAddressAllowed('198.51.100.5', ['203.0.113.0/24'])).toBe(false);
    });

    test('matches IPv4-mapped IPv6 addresses against IPv4 ranges', () => {
      expect(ipUtils.isAddressAllowed('::ffff:203.0.113.5', ['203.0.113.0/24'])).toBe(true);
    });

    test('supports bare addresses without a prefix', () => {
      expect(ipUtils.isAddressAllowed('203.0.113.5', ['203.0.113.5'])).toBe(true);
      expect(ipUtils.isAddressAllowed('203.0.113.6', ['203.0.113.5'])).toBe(false);
    });

    test('rejects entries with a non-integer prefix', () => {
      expect(ipUtils.isAddressAllowed('203.0.113.5', ['203.0.113.0/abc'])).toBe(false);
    });

    test('only matches IPv6 ranges on an exact /128', () => {
      expect(ipUtils.isAddressAllowed('2001:db8::1', ['2001:db8::1/128'])).toBe(true);
      expect(ipUtils.isAddressAllowed('2001:db8::2', ['2001:db8::1/128'])).toBe(false);
    });
  });
});
