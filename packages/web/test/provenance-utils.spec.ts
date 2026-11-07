import { describe, expect, test } from 'vitest';

import { summarizeProvenance } from '../src/provenance-utils';
import semver from './partials/attestations-semver.json';

const encode = (statement: unknown) =>
  Buffer.from(JSON.stringify(statement), 'utf8').toString('base64');

describe('summarizeProvenance', () => {
  test('reads a SLSA v1 statement from a real npmjs bundle', () => {
    const summary = summarizeProvenance(semver.attestations as any);
    expect(summary).toEqual({
      predicateType: 'https://slsa.dev/provenance/v1',
      buildType: 'https://slsa-framework.github.io/github-actions-buildtypes/workflow/v1',
      builder: 'https://github.com/actions/runner/github-hosted',
      sourceRepository: 'https://github.com/npm/node-semver',
      sourceRef: 'refs/heads/main',
      sourceCommit: 'b37b033b585ad5e575afeccadb426ea41bc6cea4',
      workflowPath: '.github/workflows/release.yml',
      buildRunUrl: 'https://github.com/npm/node-semver/actions/runs/41486847600/attempts/1',
      transparencyLogIndex: 3644633127,
      transparencyLogUrl: 'https://search.sigstore.dev/?logIndex=3644633127',
      hasPublishAttestation: true,
    });
  });

  test('reads a SLSA v0.2 statement', () => {
    const statement = {
      predicate: {
        buildType: 'https://github.com/npm/cli/gha/v2',
        builder: { id: 'https://github.com/actions/runner' },
        invocation: {
          configSource: {
            uri: 'git+https://github.com/org/repo@refs/heads/main',
            digest: { sha1: 'abc1234' },
            entryPoint: '.github/workflows/publish.yml',
          },
        },
        metadata: { buildInvocationId: 'https://github.com/org/repo/actions/runs/1' },
      },
    };
    const summary = summarizeProvenance([
      {
        predicateType: 'https://slsa.dev/provenance/v0.2',
        bundle: {
          dsseEnvelope: { payload: encode(statement) },
          verificationMaterial: { tlogEntries: [{ logIndex: '42' }] },
        },
      },
    ]);
    expect(summary).toMatchObject({
      sourceRepository: 'https://github.com/org/repo',
      sourceRef: 'refs/heads/main',
      sourceCommit: 'abc1234',
      workflowPath: '.github/workflows/publish.yml',
      transparencyLogIndex: 42,
      hasPublishAttestation: false,
    });
  });

  test('reads the GitLab CI/CD statement npm generates', () => {
    const statement = {
      predicate: {
        buildType: 'https://github.com/npm/cli/gitlab/v0alpha1',
        builder: { id: 'https://gitlab.com/group/project/-/runners/12345' },
        invocation: {
          configSource: {
            uri: 'git+https://gitlab.com/group/project',
            digest: { sha1: 'def4567' },
            entryPoint: 'publish',
          },
        },
      },
    };
    const summary = summarizeProvenance([
      {
        predicateType: 'https://slsa.dev/provenance/v0.2',
        bundle: { dsseEnvelope: { payload: encode(statement) } },
      },
    ]);
    expect(summary).toMatchObject({
      buildType: 'https://github.com/npm/cli/gitlab/v0alpha1',
      builder: 'https://gitlab.com/group/project/-/runners/12345',
      sourceRepository: 'https://gitlab.com/group/project',
      sourceCommit: 'def4567',
      workflowPath: 'publish',
    });
    expect(summary?.sourceRef).toBeUndefined();
    expect(summary?.transparencyLogUrl).toBeUndefined();
  });

  test('ignores malformed entries and unset log indices', () => {
    const summary = summarizeProvenance([
      null as any,
      { predicateType: 42 as any, bundle: {} },
      {
        predicateType: 'https://slsa.dev/provenance/v1',
        bundle: {
          dsseEnvelope: {
            payload: encode({
              predicate: {
                buildDefinition: {
                  externalParameters: { workflow: { repository: 123, path: ['x'] } },
                  resolvedDependencies: [
                    {
                      uri: 'git+https://github.com/other/dep@v1',
                      digest: { gitCommit: 'bad0000' },
                    },
                    {
                      uri: 'git+https://github.com/org/repo@main',
                      digest: { gitCommit: 'c0ffee1' },
                    },
                  ],
                },
                runDetails: { builder: { id: null }, metadata: { invocationId: {} } },
              },
            }),
          },
          verificationMaterial: { tlogEntries: [{ logIndex: null }] },
        },
      },
    ]);
    expect(summary).toEqual({
      predicateType: 'https://slsa.dev/provenance/v1',
      hasPublishAttestation: false,
    });
  });

  test('takes the commit of the workflow repository dependency', () => {
    const statement = {
      predicate: {
        buildDefinition: {
          externalParameters: {
            workflow: { repository: 'https://github.com/org/repo', ref: 'refs/heads/main' },
          },
          resolvedDependencies: [
            { uri: 'git+https://github.com/other/dep@v1', digest: { gitCommit: 'bad0000' } },
            {
              uri: 'git+https://github.com/org/repo@refs/heads/release',
              digest: { gitCommit: 'e1ea5e0' },
            },
            { uri: 'git+https://github.com/org/repository@v1', digest: { gitCommit: 'aaa1111' } },
            { uri: 'git+https://github.com/org/repo@v0', digest: { gitCommit: 'bad/../sha' } },
            {
              uri: 'git+https://github.com/org/repo@refs/heads/main',
              digest: { gitCommit: 'c0ffee1' },
            },
          ],
        },
      },
    };
    const summary = summarizeProvenance([
      {
        predicateType: 'https://slsa.dev/provenance/v1',
        bundle: { dsseEnvelope: { payload: encode(statement) } },
      },
    ]);
    expect(summary?.sourceCommit).toBe('c0ffee1');
  });

  test('omits the commit when no dependency is the workflow repository', () => {
    const statement = {
      predicate: {
        buildDefinition: {
          externalParameters: { workflow: { repository: 'https://github.com/org/repo' } },
          resolvedDependencies: [
            { uri: 'git+https://github.com/other/dep@v1', digest: { gitCommit: 'bad0000' } },
          ],
        },
      },
    };
    const summary = summarizeProvenance([
      {
        predicateType: 'https://slsa.dev/provenance/v1',
        bundle: { dsseEnvelope: { payload: encode(statement) } },
      },
    ]);
    expect(summary?.sourceCommit).toBeUndefined();
  });

  test('returns null without a provenance attestation', () => {
    expect(summarizeProvenance([])).toBeNull();
    expect(
      summarizeProvenance([{ predicateType: semver.attestations[0].predicateType, bundle: {} }])
    ).toBeNull();
  });

  test('keeps the predicate type when the payload cannot be decoded', () => {
    const summary = summarizeProvenance([
      {
        predicateType: 'https://slsa.dev/provenance/v1',
        bundle: { dsseEnvelope: { payload: '%%' } },
      },
    ]);
    expect(summary).toEqual({
      predicateType: 'https://slsa.dev/provenance/v1',
      hasPublishAttestation: false,
    });
  });
});
