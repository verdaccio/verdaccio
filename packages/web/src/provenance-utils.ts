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

// the bundle is raw uplink data: every field is checked before it reaches the UI
const str = (value: unknown): string | undefined =>
  typeof value === 'string' && value.length > 0 ? value : undefined;

function logIndexOf(bundle: any): number | undefined {
  const raw = bundle?.verificationMaterial?.tlogEntries?.[0]?.logIndex;
  if (typeof raw !== 'number' && !(typeof raw === 'string' && /^\d+$/.test(raw))) {
    return undefined;
  }
  const index = Number(raw);
  return Number.isSafeInteger(index) && index >= 0 ? index : undefined;
}

// `git+https://github.com/org/repo@ref` and `https://github.com/org/repo/` → `github.com/org/repo`
const repositoryKey = (value?: string) =>
  value
    ?.replace(/^git\+/, '')
    .split('@')[0]
    .replace(/^https?:\/\//, '')
    .replace(/\.git$/, '')
    .replace(/\/+$/, '')
    .toLowerCase();

// the dependency whose repository is exactly the workflow one; a lone dependency is taken as such
function workflowCommit(dependencies: unknown, repository?: string): string | undefined {
  if (!Array.isArray(dependencies)) {
    return undefined;
  }
  const origin = repositoryKey(repository);
  const match =
    (origin && dependencies.find((item) => repositoryKey(str(item?.uri)) === origin)) ??
    (dependencies.length === 1 ? dependencies[0] : undefined);
  return str(match?.digest?.gitCommit);
}

// SLSA v1: github-actions build type; v0.2: the shape npm used before 2024
function readPredicate(predicate: any): Partial<ProvenanceSummary> {
  if (predicate?.buildDefinition) {
    const { buildDefinition, runDetails } = predicate;
    const workflow = buildDefinition.externalParameters?.workflow ?? {};
    const repository = str(workflow.repository);
    return {
      buildType: str(buildDefinition.buildType),
      builder: str(runDetails?.builder?.id),
      sourceRepository: repository,
      sourceRef: str(workflow.ref),
      sourceCommit: workflowCommit(buildDefinition.resolvedDependencies, repository),
      workflowPath: str(workflow.path),
      buildRunUrl: str(runDetails?.metadata?.invocationId),
    };
  }
  const source = predicate?.invocation?.configSource ?? {};
  const [repository, ref] =
    str(source.uri)
      ?.replace(/^git\+/, '')
      .split('@') ?? [];
  return {
    buildType: str(predicate?.buildType),
    builder: str(predicate?.builder?.id),
    sourceRepository: str(repository),
    sourceRef: str(ref),
    sourceCommit: str(source.digest?.sha1),
    workflowPath: str(source.entryPoint),
    buildRunUrl: str(predicate?.metadata?.buildInvocationId),
  };
}

/** Reads what the provenance statement says about the build; null when there is no provenance attestation. */
export function summarizeProvenance(attestations: Attestation[]): ProvenanceSummary | null {
  const typeOf = (item: Attestation | null | undefined) => str(item?.predicateType) ?? '';
  const provenance = attestations.find((item) => typeOf(item).startsWith(PROVENANCE_PREFIX));
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
    hasPublishAttestation: attestations.some((item) => typeOf(item).startsWith(PUBLISH_PREFIX)),
  };
  return Object.fromEntries(
    Object.entries(summary).filter(([, value]) => value !== undefined)
  ) as ProvenanceSummary;
}
