import { describe, expect, it } from 'vitest';

import { validateUnPublishSingleVersion } from '../src/schemes/unpublish-manifest';

describe('validatePublishSingleVersion', () => {
  it('should validate a valid manifest correctly', () => {
    const validManifest = {
      name: '@juanpicado/test2',
      versions: {
        '3.0.2-0': {
          name: '@juanpicado/test2',
        },
      },
      _rev: '9-17c706cc377dc959',
      _id: '@juanpicado/test2',
      time: {
        created: '2024-11-02T14:33:06.170Z',
        modified: '2024-11-02T14:33:22.919Z',
        '3.0.2-0': '2024-11-02T14:33:06.208Z',
        '3.0.3-0': '2024-11-02T14:33:19.520Z',
      },
      readme: 'ERROR: No README data found!',
      'dist-tags': {
        latest: '3.0.3-0',
      },
    };

    const result = validateUnPublishSingleVersion(validManifest);
    expect(result).toBe(true);
  });

  it('should invalidate a manifest missing required properties', () => {
    const invalidManifest = {
      name: '@juanpicado/test2',
      versions: {
        '3.0.2-0': {
          name: '@juanpicado/test2',
        },
      },
    };

    const result = validateUnPublishSingleVersion(invalidManifest);
    expect(result).toBe(false);
  });

  it('should invalidate a manifest with empty versions object', () => {
    const invalidManifest = {
      name: '@juanpicado/test2',
      versions: {},
      _rev: '9-17c706cc377dc959',
      _id: '@juanpicado/test2',
      time: {
        created: '2024-11-02T14:33:06.170Z',
        modified: '2024-11-02T14:33:22.919Z',
        '3.0.2-0': '2024-11-02T14:33:06.208Z',
      },
      readme: 'ERROR: No README data found!',
      'dist-tags': {
        latest: '3.0.3-0',
      },
    };

    const result = validateUnPublishSingleVersion(invalidManifest);
    expect(result).toBe(false);
  });

  it('should invalidate a null manifest', () => {
    const result = validateUnPublishSingleVersion(null);
    expect(result).toBe(false);
  });
});
