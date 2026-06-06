import net from 'node:net';

const IPV4_MAPPED_PREFIX = '::ffff:';

/**
 * Trim an address and strip the IPv4-mapped IPv6 prefix (`::ffff:`) so that
 * mapped addresses are compared as plain IPv4.
 */
export function normalizeAddress(address?: string): string | undefined {
  if (!address) {
    return;
  }

  const trimmedAddress = address.trim();

  if (trimmedAddress.startsWith(IPV4_MAPPED_PREFIX)) {
    return trimmedAddress.slice(IPV4_MAPPED_PREFIX.length);
  }

  return trimmedAddress;
}

/**
 * Convert a dotted-quad IPv4 address into its unsigned 32-bit integer value.
 */
export function parseIPv4(address: string): number | undefined {
  if (net.isIP(address) !== 4) {
    return;
  }

  return (
    address
      .split('.')
      .map(Number)
      .reduce((accumulator, octet) => (accumulator << 8) + octet, 0) >>> 0
  );
}

/**
 * Whether an IPv4 `address` falls inside the `range`/`prefix` CIDR block.
 */
export function isIPv4InCIDR(address: string, range: string, prefix: number): boolean {
  const addressNumber = parseIPv4(address);
  const rangeNumber = parseIPv4(range);

  if (
    addressNumber === undefined ||
    rangeNumber === undefined ||
    prefix < 0 ||
    prefix > 32
  ) {
    return false;
  }

  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;

  return (addressNumber & mask) === (rangeNumber & mask);
}

/**
 * Whether `address` is allowed by the provided `cidr` whitelist. An empty or
 * missing whitelist allows every address; an unparseable address is rejected.
 */
export function isAddressAllowed(
  address: string | undefined,
  cidr: string[] | undefined
): boolean {
  if (!cidr || cidr.length === 0) {
    return true;
  }

  const normalizedAddress = normalizeAddress(address);

  if (!normalizedAddress) {
    return false;
  }

  return cidr.some((entry) => {
    const [range, prefixValue] = entry.split('/');
    const normalizedRange = normalizeAddress(range);

    if (!normalizedRange) {
      return false;
    }

    if (typeof prefixValue === 'undefined') {
      return normalizedAddress === normalizedRange;
    }

    const prefix = Number(prefixValue);

    if (Number.isInteger(prefix) === false) {
      return false;
    }

    if (net.isIP(normalizedAddress) === 4 && net.isIP(normalizedRange) === 4) {
      return isIPv4InCIDR(normalizedAddress, normalizedRange, prefix);
    }

    return prefix === 128 && normalizedAddress === normalizedRange;
  });
}
