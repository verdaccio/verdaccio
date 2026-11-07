import React from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { cleanup, fireEvent, render, waitFor } from '../../test/test-react-testing-library';
import type { PackageMetaInterface } from '../../types/packageMeta';
import Provenance, { builderLabel, commitUrl, provenanceLabel, workflowUrl } from './Provenance';

const requestMock = vi.hoisted(() => vi.fn());
vi.mock('../../store/api', () => ({ default: { request: requestMock } }));

const meta = (dist: Record<string, unknown>): PackageMetaInterface => ({
  latest: {
    name: 'semver',
    version: '7.8.6',
    dist: { fileCount: 1, unpackedSize: 10, ...dist },
  },
  _uplinks: {},
});

const attestations = {
  url: 'https://registry.npmjs.org/-/npm/v1/attestations/semver@7.8.6',
  provenance: { predicateType: 'https://slsa.dev/provenance/v1' },
};

const summary = {
  name: 'semver',
  version: '7.8.6',
  predicateType: 'https://slsa.dev/provenance/v1',
  signatures: [{ keyid: 'SHA256:DhQ8' }],
  builder: 'https://github.com/actions/runner/github-hosted',
  sourceRepository: 'https://github.com/npm/node-semver',
  sourceRef: 'refs/heads/main',
  sourceCommit: 'b37b033b585ad5e575afeccadb426ea41bc6cea4',
  workflowPath: '.github/workflows/release.yml',
  buildRunUrl: 'https://github.com/npm/node-semver/actions/runs/41486847600/attempts/1',
  transparencyLogIndex: 3644633127,
  transparencyLogUrl: 'https://search.sigstore.dev/?logIndex=3644633127',
  hasPublishAttestation: true,
};

describe('<Provenance /> component', () => {
  beforeEach(() => {
    requestMock.mockReset();
    requestMock.mockResolvedValue(summary);
  });

  afterEach(() => {
    cleanup();
  });

  test('renders nothing without signatures or attestations', () => {
    const { container } = render(<Provenance packageMeta={meta({})} packageName="semver" />);
    expect(container).toBeEmptyDOMElement();
    expect(requestMock).not.toHaveBeenCalled();
  });

  test('signature only: badge opens a dialog with the key ids, no details request', async () => {
    const { getByTestId, getByText, queryByTestId } = render(
      <Provenance
        packageMeta={meta({
          signatures: [
            { keyid: 'SHA256:DhQ8', sig: 'MEUC' },
            { keyid: 'SHA256:DhQ8', sig: 'MEUC' },
          ],
        })}
        packageName="semver"
      />
    );
    const badge = getByTestId('provenance-badge');
    expect(badge).toHaveTextContent('sidebar.provenance.registry-signature');
    expect(getByText('sidebar.provenance.title')).toBeInTheDocument();
    expect(queryByTestId('registryInfo--dialog')).not.toBeInTheDocument();
    fireEvent.click(badge);
    await waitFor(() => expect(getByTestId('registryInfo--dialog')).toBeInTheDocument());
    expect(getByText('semver@7.8.6')).toBeInTheDocument();
    expect(getByText('SHA256:DhQ8')).toBeInTheDocument();
    expect(getByText('sidebar.provenance.disclaimer')).toBeInTheDocument();
    expect(requestMock).not.toHaveBeenCalled();
  });

  test('ignores malformed metadata fields', async () => {
    const { getByTestId, getByText, queryByText } = render(
      <Provenance
        packageMeta={meta({
          attestations: { url: attestations.url, provenance: {} },
          signatures: [null, { keyid: 'SHA256:ok', sig: 'MEUC' }, { sig: 'orphan' }],
        })}
        packageName="semver"
      />
    );
    const badge = getByTestId('provenance-badge');
    expect(badge).toHaveTextContent('sidebar.provenance.registry-signature');
    fireEvent.click(badge);
    await waitFor(() => expect(getByText('SHA256:ok')).toBeInTheDocument());
    expect(queryByText('sidebar.provenance.provenance:', { exact: false })).not.toBeInTheDocument();
    expect(getByText('registry.npmjs.org/-/npm/v1/attestations/semver@7.8.6')).toBeInTheDocument();
  });

  test('tolerates signatures that are not an array', () => {
    const { getByTestId } = render(
      <Provenance packageMeta={meta({ attestations, signatures: 'nope' })} packageName="semver" />
    );
    expect(getByTestId('provenance-badge')).toHaveTextContent(
      'sidebar.provenance.provenance: SLSA v1'
    );
  });

  test('renders nothing when every field is malformed', () => {
    const { container } = render(
      <Provenance
        packageMeta={meta({ attestations: { provenance: {} }, signatures: [null] })}
        packageName="semver"
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('provenance: the details are requested only when the dialog opens', async () => {
    const { getByTestId, getByText } = render(
      <Provenance
        packageMeta={meta({ signatures: [{ keyid: 'SHA256:DhQ8', sig: 'MEUC' }], attestations })}
        packageName="semver"
        showDetails={true}
        version="7.8.6"
      />
    );
    const badge = getByTestId('provenance-badge');
    expect(badge).toHaveTextContent('sidebar.provenance.provenance: SLSA v1');
    expect(requestMock).not.toHaveBeenCalled();
    fireEvent.click(badge);
    await waitFor(() => expect(getByText('GitHub Actions')).toBeInTheDocument());
    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(requestMock.mock.calls[0][0]).toBe(
      'http://localhost:9000/-/verdaccio/data/package/provenance/semver?v=7.8.6'
    );
    expect(getByText('github.com/npm/node-semver')).toHaveAttribute(
      'href',
      'https://github.com/npm/node-semver'
    );
    expect(getByText('b37b033b585a')).toHaveAttribute(
      'href',
      'https://github.com/npm/node-semver/commit/b37b033b585ad5e575afeccadb426ea41bc6cea4'
    );
    expect(getByText('.github/workflows/release.yml')).toHaveAttribute(
      'href',
      'https://github.com/npm/node-semver/blob/b37b033b585ad5e575afeccadb426ea41bc6cea4/.github/workflows/release.yml'
    );
    expect(getByText('#3644633127')).toHaveAttribute(
      'href',
      'https://search.sigstore.dev/?logIndex=3644633127'
    );
  });

  test('never asks for details on servers without the endpoint', async () => {
    const { getByTestId, getByText } = render(
      <Provenance packageMeta={meta({ attestations })} packageName="semver" version="7.8.6" />
    );
    fireEvent.click(getByTestId('provenance-badge'));
    await waitFor(() => expect(getByTestId('registryInfo--dialog')).toBeInTheDocument());
    expect(getByText('registry.npmjs.org/-/npm/v1/attestations/semver@7.8.6')).toHaveAttribute(
      'href',
      'https://registry.npmjs.org/-/npm/v1/attestations/semver@7.8.6'
    );
    expect(requestMock).not.toHaveBeenCalled();
  });

  test('keeps the summary when the details endpoint fails', async () => {
    requestMock.mockRejectedValue(new Error('not found'));
    const { getByTestId, getByText, queryByText } = render(
      <Provenance
        packageMeta={meta({
          attestations: {
            ...attestations,
            provenance: { predicateType: 'https://slsa.dev/provenance/v0.2' },
          },
        })}
        packageName="semver"
        showDetails={true}
      />
    );
    fireEvent.click(getByTestId('provenance-badge'));
    await waitFor(() => expect(requestMock).toHaveBeenCalled());
    expect(getByText('registry.npmjs.org/-/npm/v1/attestations/semver@7.8.6')).toHaveAttribute(
      'href',
      'https://registry.npmjs.org/-/npm/v1/attestations/semver@7.8.6'
    );
    expect(queryByText('sidebar.provenance.built-on')).not.toBeInTheDocument();
  });

  test('links GitLab commits under /-/commit/ and shows the job name as text', async () => {
    requestMock.mockResolvedValue({
      ...summary,
      buildType: 'https://github.com/npm/cli/gitlab/v0alpha1',
      builder: 'https://gitlab.com/group/project/-/runners/12345',
      sourceRepository: 'https://gitlab.com/group/project',
      sourceRef: undefined,
      sourceCommit: 'def4567890abcdef',
      workflowPath: 'publish',
      buildRunUrl: undefined,
    });
    const { getByTestId, getByText } = render(
      <Provenance
        packageMeta={meta({ attestations })}
        packageName="semver"
        showDetails={true}
        version="7.8.6"
      />
    );
    fireEvent.click(getByTestId('provenance-badge'));
    await waitFor(() => expect(getByText('GitLab CI/CD')).toBeInTheDocument());
    expect(getByText('def4567890ab')).toHaveAttribute(
      'href',
      'https://gitlab.com/group/project/-/commit/def4567890abcdef'
    );
    expect(getByText('publish').closest('a')).toBeNull();
  });

  test('renders unsafe urls as plain text', async () => {
    const { getByTestId, getByText } = render(
      <Provenance
        packageMeta={meta({
          attestations: { ...attestations, url: 'javascript:alert(1)' },
        })}
        packageName="semver"
      />
    );
    fireEvent.click(getByTestId('provenance-badge'));
    await waitFor(() => expect(getByText('javascript:alert(1)')).toBeInTheDocument());
    expect(getByText('javascript:alert(1)').closest('a')).toBeNull();
  });

  test('labels', () => {
    expect(provenanceLabel('https://slsa.dev/provenance/v1')).toBe('SLSA v1');
    expect(provenanceLabel('https://example.test/provenance/v1')).toBe(
      'https://example.test/provenance/v1'
    );
    expect(provenanceLabel('https://example.test/custom')).toBe('https://example.test/custom');
    expect(builderLabel('https://evil.test/github.com/actions/runner/x')).toBe(
      'https://evil.test/github.com/actions/runner/x'
    );
    expect(commitUrl('https://github.com/o/r', 'abc')).toBe('https://github.com/o/r/commit/abc');
    expect(commitUrl('https://github.com/o/r', 'a#b?c/d')).toBe(
      'https://github.com/o/r/commit/a%23b%3Fc%2Fd'
    );
    expect(workflowUrl('https://github.com/o/r', 'abc', '.github/workflows/re lease#1.yml')).toBe(
      'https://github.com/o/r/blob/abc/.github/workflows/re%20lease%231.yml'
    );
    expect(
      commitUrl('https://gitlab.com/g/p', 'abc', 'https://github.com/npm/cli/gitlab/v0alpha1')
    ).toBe('https://gitlab.com/g/p/-/commit/abc');
    expect(builderLabel('https://github.com/actions/runner/github-hosted')).toBe('GitHub Actions');
    expect(builderLabel('https://github.com/actions/runner/self-hosted')).toBe(
      'GitHub Actions (self-hosted)'
    );
    expect(
      builderLabel(
        'https://gitlab.com/group/project/-/runners/12345',
        'https://github.com/npm/cli/gitlab/v0alpha1'
      )
    ).toBe('GitLab CI/CD');
    expect(builderLabel('https://example.test/builder', 'https://example.test/build/v1')).toBe(
      'https://example.test/builder'
    );
  });
});
