import React from 'react';

import { default as Provenance } from '.';

export default {
  title: 'Components/Sidebar/Provenance',
};

const dist = {
  fileCount: 54,
  unpackedSize: 118657,
  signatures: [{ keyid: 'SHA256:DhQ8wR5APBvFHLF/+Tc+AYvPOdTpcIDqOhxsBHRwC7U', sig: 'MEUC' }],
  attestations: {
    url: 'https://registry.npmjs.org/-/npm/v1/attestations/semver@7.8.6',
    provenance: { predicateType: 'https://slsa.dev/provenance/v1' },
  },
};

// click the badge to open the dialog; the details come from the msw mock
export const WithProvenance: any = () => (
  <Provenance
    packageMeta={{ latest: { name: 'semver', version: '7.8.6', dist }, _uplinks: {} }}
    packageName="semver"
    showDetails={true}
    version="7.8.6"
  />
);

export const SignatureOnly: any = () => (
  <Provenance
    packageMeta={{
      latest: { name: 'lodash', version: '4.17.21', dist: { ...dist, attestations: undefined } },
      _uplinks: {},
    }}
    packageName="lodash"
  />
);
