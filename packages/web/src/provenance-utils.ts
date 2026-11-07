export interface ProvenanceSummary {
  predicateType: string;
  buildType?: string;
  builder?: string;
  sourceRepository?: string;
  sourceRef?: string;
  sourceCommit?: string;
  workflowPath?: string;
  buildRunUrl?: string;
  transparencyLogIndex?: number;
  transparencyLogUrl?: string;
  hasPublishAttestation: boolean;
}

const PROVENANCE_PREFIX = 'https://slsa.dev/provenance/';
const PUBLISH_PREFIX = 'https://github.com/npm/attestation/tree/main/specs/publish/';
const TRANSPARENCY_LOG = 'https://search.sigstore.dev/?logIndex=';

export interface Attestation {
  predicateType: string;
  bundle: unknown;
}

function decodeStatement(bundle: any): any | undefined {
  const payload = bundle?.dsseEnvelope?.payload;
  if (typeof payload !== 'string') {
    return undefined;
  }
  try {
    return JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
  } catch {
    return undefined;
  }
}

function logIndexOf(bundle: any): number | undefined {
  const index = Number(bundle?.verificationMaterial?.tlogEntries?.[0]?.logIndex);
  return Number.isSafeInteger(index) && index >= 0 ? index : undefined;
}

// SLSA v1: github-actions build type; v0.2: the shape npm used before 2024
function readPredicate(predicate: any): Partial<ProvenanceSummary> {
  if (predicate?.buildDefinition) {
    const { buildDefinition, runDetails } = predicate;
    const workflow = buildDefinition.externalParameters?.workflow ?? {};
    return {
      buildType: buildDefinition.buildType,
      builder: runDetails?.builder?.id,
      sourceRepository: workflow.repository,
      sourceRef: workflow.ref,
      sourceCommit: buildDefinition.resolvedDependencies?.[0]?.digest?.gitCommit,
      workflowPath: workflow.path,
      buildRunUrl: runDetails?.metadata?.invocationId,
    };
  }
  const source = predicate?.invocation?.configSource ?? {};
  const [repository, ref] =
    typeof source.uri === 'string' ? source.uri.replace(/^git\+/, '').split('@') : [];
  return {
    buildType: predicate?.buildType,
    builder: predicate?.builder?.id,
    sourceRepository: repository,
    sourceRef: ref,
    sourceCommit: source.digest?.sha1,
    workflowPath: source.entryPoint,
    buildRunUrl: predicate?.metadata?.buildInvocationId,
  };
}

/** Reads what the provenance statement says about the build; null when there is no provenance attestation. */
export function summarizeProvenance(attestations: Attestation[]): ProvenanceSummary | null {
  const provenance = attestations.find((item) => item.predicateType?.startsWith(PROVENANCE_PREFIX));
  if (!provenance) {
    return null;
  }
  const statement = decodeStatement(provenance.bundle);
  const logIndex = logIndexOf(provenance.bundle);
  const summary: ProvenanceSummary = {
    predicateType: provenance.predicateType,
    ...readPredicate(statement?.predicate),
    transparencyLogIndex: logIndex,
    transparencyLogUrl: logIndex === undefined ? undefined : `${TRANSPARENCY_LOG}${logIndex}`,
    hasPublishAttestation: attestations.some((item) =>
      item.predicateType?.startsWith(PUBLISH_PREFIX)
    ),
  };
  return Object.fromEntries(
    Object.entries(summary).filter(([, value]) => value !== undefined)
  ) as ProvenanceSummary;
}
