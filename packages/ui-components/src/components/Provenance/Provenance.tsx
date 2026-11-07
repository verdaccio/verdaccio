import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import type { FC } from 'react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useData } from '../../api/use-data';
import { getConfiguration } from '../../configuration';
import { stripTrailingSlash } from '../../store/utils';
import type { PackageMetaInterface, Signature } from '../../types/packageMeta';
import type { ProvenanceSummary } from '../../types/provenance';
import { APIRoute } from '../../utils/routes';
import { isURL } from '../../utils/url';
import { DistChips, DistListItem, StyledText } from '../Distribution/styles';
import RegistryInfoDialog from '../RegistryInfoDialog';

// `https://slsa.dev/provenance/v1` → `SLSA v1`; other predicate types are shown as they are
export function provenanceLabel(predicateType: string): string {
  const version = predicateType.match(/^https:\/\/slsa\.dev\/provenance\/(v[\d.]+)$/)?.[1];
  return version ? `SLSA ${version}` : predicateType;
}

const isGitLab = (buildType?: string) => buildType?.startsWith('https://github.com/npm/cli/gitlab');

// npm and Yarn generate provenance on GitHub Actions (SLSA v1) and GitLab CI/CD (npm's own v0.2 build type)
export function builderLabel(builder: string, buildType?: string): string {
  if (isGitLab(buildType)) {
    return 'GitLab CI/CD';
  }
  if (/^https:\/\/github\.com\/actions\/runner(\/|$)/.test(builder)) {
    return builder.endsWith('/self-hosted') ? 'GitHub Actions (self-hosted)' : 'GitHub Actions';
  }
  return builder;
}

// GitLab statements carry the job name here, GitHub ones the workflow file
const isWorkflowFile = (entry: string) => /\.ya?ml$/.test(entry);

// GitLab commit pages live under `/-/commit/`, GitHub (and most forges) under `/commit/`
export function commitUrl(repository: string, commit: string, buildType?: string): string {
  return `${repository}/${isGitLab(buildType) ? '-/commit' : 'commit'}/${encodeURIComponent(commit)}`;
}

// each segment of the workflow path is encoded on its own so `/` keeps separating them
export function workflowUrl(repository: string, commit: string, workflowPath: string): string {
  const path = workflowPath.split('/').map(encodeURIComponent).join('/');
  return `${repository}/blob/${encodeURIComponent(commit)}/${path}`;
}

// `dist.attestations` and `dist.signatures` come straight from package metadata, not from the decoder
type ProvenanceMeta = { url?: string; provenance?: { predicateType: string } };

function readAttestations(raw: unknown): ProvenanceMeta | undefined {
  const value = raw as { url?: unknown; provenance?: { predicateType?: unknown } } | undefined;
  const url = typeof value?.url === 'string' && value.url.length > 0 ? value.url : undefined;
  const predicateType = value?.provenance?.predicateType;
  const provenance =
    typeof predicateType === 'string' && predicateType.length > 0 ? { predicateType } : undefined;
  return url || provenance ? { url, provenance } : undefined;
}

function readSignatures(raw: unknown): Signature[] {
  return Array.isArray(raw)
    ? raw.filter((item): item is Signature => typeof item?.keyid === 'string' && item.keyid !== '')
    : [];
}

// every url here comes from the registry metadata or the attestation bundle
const isHttpUrl = (href: string) => /^https?:\/\//i.test(href) && isURL(href);

const ExternalLink: FC<{ href: string; children: React.ReactNode }> = ({ href, children }) =>
  isHttpUrl(href) ? (
    <Link href={href} rel="noopener noreferrer" target="_blank" underline="hover">
      {children}
    </Link>
  ) : (
    <>{children}</>
  );

const Detail: FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <ListItem disableGutters={true} sx={{ py: 0.5 }}>
    <ListItemText
      primary={label}
      secondary={children}
      secondaryTypographyProps={{ component: 'div' }}
    />
  </ListItem>
);

const BuildDetails: FC<{ packageName: string; version?: string }> = ({ packageName, version }) => {
  const { t } = useTranslation();
  const basePath = stripTrailingSlash(getConfiguration().base);
  const { data, error, isLoading } = useData<ProvenanceSummary>(
    basePath,
    APIRoute.PROVENANCE,
    packageName,
    version,
    { shouldRetryOnError: false }
  );

  if (isLoading) {
    return <CircularProgress data-testid="provenance-loading" size={24} sx={{ my: 2 }} />;
  }
  // the summary above is enough when the endpoint fails
  if (error || !data || typeof data !== 'object') {
    return null;
  }

  const repository = data.sourceRepository;
  const commit = data.sourceCommit;
  return (
    <>
      {data.builder ? (
        <Detail label={t('sidebar.provenance.built-on')}>
          {builderLabel(data.builder, data.buildType)}
        </Detail>
      ) : null}
      {repository ? (
        <Detail label={t('sidebar.provenance.source')}>
          <ExternalLink href={repository}>{repository.replace(/^https?:\/\//, '')}</ExternalLink>
          {data.sourceRef ? ` (${data.sourceRef.replace(/^refs\/heads\//, '')})` : ''}
        </Detail>
      ) : null}
      {repository && commit ? (
        <Detail label={t('sidebar.provenance.commit')}>
          <ExternalLink href={commitUrl(repository, commit, data.buildType)}>
            {commit.slice(0, 12)}
          </ExternalLink>
        </Detail>
      ) : null}
      {data.workflowPath ? (
        <Detail label={t('sidebar.provenance.workflow')}>
          {repository && commit && isWorkflowFile(data.workflowPath) ? (
            <ExternalLink href={workflowUrl(repository, commit, data.workflowPath)}>
              {data.workflowPath}
            </ExternalLink>
          ) : (
            data.workflowPath
          )}
        </Detail>
      ) : null}
      {data.buildRunUrl ? (
        <Detail label={t('sidebar.provenance.build-run')}>
          <ExternalLink href={data.buildRunUrl}>
            {data.buildRunUrl.replace(/^https?:\/\//, '')}
          </ExternalLink>
        </Detail>
      ) : null}
      {data.transparencyLogUrl ? (
        <Detail label={t('sidebar.provenance.transparency-log')}>
          <ExternalLink
            href={data.transparencyLogUrl}
          >{`#${data.transparencyLogIndex}`}</ExternalLink>
        </Detail>
      ) : null}
    </>
  );
};

const ProvenanceDialog: FC<{
  open: boolean;
  onClose: () => void;
  packageName: string;
  version: string;
  attestations?: ProvenanceMeta;
  signatures: Signature[];
  showDetails: boolean;
}> = ({ open, onClose, packageName, version, attestations, signatures, showDetails }) => {
  const { t } = useTranslation();
  const provenance = attestations?.provenance;
  const keyids = [...new Set(signatures.map((signature) => signature.keyid))];

  return (
    <RegistryInfoDialog onClose={onClose} open={open} title={t('sidebar.provenance.title')}>
      <Typography sx={{ pt: 2 }} variant="subtitle2">{`${packageName}@${version}`}</Typography>
      <Typography color="text.secondary" variant="body2">
        {t('sidebar.provenance.disclaimer')}
      </Typography>
      <List dense={true}>
        {provenance ? (
          <Detail label={t('sidebar.provenance.provenance')}>
            {provenanceLabel(provenance.predicateType)}
          </Detail>
        ) : null}
        {keyids.length > 0 ? (
          <Detail label={t('sidebar.provenance.registry-signature')}>
            {keyids.map((keyid) => (
              <div key={keyid}>{keyid}</div>
            ))}
          </Detail>
        ) : null}
        {attestations?.url ? (
          <Detail label={t('sidebar.provenance.attestation')}>
            <ExternalLink href={attestations.url}>
              {attestations.url.replace(/^https?:\/\//, '')}
            </ExternalLink>
          </Detail>
        ) : null}
        {showDetails && provenance && open ? (
          <BuildDetails packageName={packageName} version={version} />
        ) : null}
      </List>
    </RegistryInfoDialog>
  );
};

/** "Provenance" sidebar section; its chip opens a dialog with the provenance and signature details. */
const Provenance: FC<{
  packageMeta: PackageMetaInterface;
  packageName: string;
  version?: string;
  // only servers exposing the provenance endpoint (ui option `capabilities.provenance`)
  showDetails?: boolean;
}> = ({ packageMeta, packageName, version, showDetails = false }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const latest = packageMeta?.latest;
  const attestations = readAttestations(latest?.dist?.attestations);
  const signatures = readSignatures(latest?.dist?.signatures);
  const provenance = attestations?.provenance;

  if (!provenance && signatures.length === 0) {
    return null;
  }

  return (
    <List subheader={<StyledText variant="subtitle1">{t('sidebar.provenance.title')}</StyledText>}>
      <DistListItem>
        <DistChips
          clickable={true}
          color={provenance ? 'primary' : 'default'}
          data-testid="provenance-badge"
          icon={provenance ? <VerifiedUserIcon /> : <VerifiedUserOutlinedIcon />}
          label={
            provenance ? (
              <>
                <b>{t('sidebar.provenance.provenance')}</b>
                {': '}
                {provenanceLabel(provenance.predicateType)}
              </>
            ) : (
              <b>{t('sidebar.provenance.registry-signature')}</b>
            )
          }
          onClick={() => setOpen(true)}
          variant="outlined"
        />
      </DistListItem>
      <ProvenanceDialog
        attestations={attestations}
        onClose={() => setOpen(false)}
        open={open}
        packageName={packageName}
        showDetails={showDetails}
        signatures={signatures}
        version={version || latest?.version || ''}
      />
    </List>
  );
};

export default Provenance;
