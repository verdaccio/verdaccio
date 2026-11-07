/** What `/-/verdaccio/data/package/provenance/:pkg` reads from the provenance statement. */
export interface ProvenanceSummary {
  name: string;
  version: string;
  predicateType: string;
  signatures: { keyid: string }[];
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
