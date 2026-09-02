---
"verdaccio": patch
---

fix: resolve fast-uri and brace-expansion security advisories

**fast-uri 3.1.6.** Bumps the `ajv/fast-uri` resolution from 3.1.5 to 3.1.6, which
fixes four high-severity advisories in the URI parser used by `ajv` for schema
format validation: host confusion via skipped IDN canonicalization
([GHSA-5jgf-p345-68v8](https://github.com/advisories/GHSA-5jgf-p345-68v8)),
SSRF via malformed IPv6 normalization
([GHSA-f65p-4m7j-42xc](https://github.com/advisories/GHSA-f65p-4m7j-42xc)),
SSRF via repeated hostname percent-decoding
([GHSA-fph4-wmhf-6fwf](https://github.com/advisories/GHSA-fph4-wmhf-6fwf)),
and host confusion via percent-encoded scheme normalization
([GHSA-jqff-g426-hqxp](https://github.com/advisories/GHSA-jqff-g426-hqxp)).

**brace-expansion DoS cleanup.** Updates the remaining vulnerable
`brace-expansion` trees (1.1.11 → 1.1.18, 2.0.1 → 2.1.4) for
[GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg) and
drops the temporary audit ignores that covered them while the patched
releases were still quarantined by the minimal-age gate.
