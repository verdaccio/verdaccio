{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "verdaccio.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "verdaccio.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "verdaccio.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "verdaccio.labels" -}}
helm.sh/chart: {{ include "verdaccio.chart" . }}
{{ include "verdaccio.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app: {{ include "verdaccio.fullname" . }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "verdaccio.selectorLabels" -}}
app.kubernetes.io/name: {{ include "verdaccio.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "verdaccio.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "verdaccio.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Renders a value that contains template.
Usage:
{{ include "tplvalues.render" ( dict "value" .Values.path.to.the.Value "context" $) }}
*/}}
{{- define "tplvalues.render" -}}
    {{- if typeIs "string" .value }}
        {{- tpl .value .context }}
    {{- else }}
        {{- tpl (.value | toYaml) .context }}
    {{- end }}
{{- end -}}

{{/*
Pod Labels

spec:
  template:
    metadata:
      labels:
        {{- include "verdaccio.podLabels" . | nindent 8 }}
*/}}
{{- define "verdaccio.podLabels" -}}
  {{- include "verdaccio.labels" . }}
  {{- $global := .Values.global }}
  {{- $local := .Values.podLabels }}
  {{- $labels := dict }}
  {{- if $global }}
    {{- range $k,$v := $global.podLabels }}
      {{- $labels = merge $labels (dict $k (tpl $v $)) }}
    {{- end }}
  {{- end }}
  {{- if $local }}
    {{- range $k,$v := $local }}
      {{- $labels = merge $labels (dict $k (tpl $v $)) }}
    {{- end }}
  {{- end }}
  {{- if (not (empty $labels)) }}
    {{- toYaml $labels | nindent 0 }}
  {{- end }}
{{- end -}}

{{/*
Pod Annotations

spec:
  template:
    metadata:
      annotations:
        {{- include "verdaccio.podAnnotations" . | nindent 8 }}
*/}}
{{- define "verdaccio.podAnnotations" -}}
  {{- $global := .Values.global }}
  {{- $local := .Values.podAnnotations }}
  {{- $annotations := dict }}
  {{- if $global }}
    {{- range $k,$v := $global.podAnnotations }}
      {{- $annotations = merge $annotations (dict $k (tpl $v $)) }}
    {{- end }}
  {{- end -}}
  {{- if $local }}
    {{- range $k,$v := $local }}
      {{- $annotations = merge $annotations (dict $k (tpl $v $)) }}
    {{- end }}
  {{- end -}}
  {{- if (not (empty $annotations)) }}
    {{- toYaml $annotations }}
  {{- end }}
{{- end }}

{{/*
# templates/deployment.yaml
spec:
  template:
    spec:
      {{- include "verdaccio.imagePullSecrets" . | nindent 6 }}

# values.yaml
image:
  pullSecrets:
  - mypullsecret
*/}}
{{- define "verdaccio.imagePullSecrets" -}}
  {{- $images := .Values.image }}
  {{- $global := .Values.global }}
  {{- $pullSecrets := list }}

  {{- if $global }}
    {{- if $global.image }}
      {{- range $global.image.pullSecrets -}}
        {{- $pullSecrets = append $pullSecrets . -}}
      {{- end -}}
    {{- end -}}
  {{- end -}}

  {{- range $images.pullSecrets -}}
    {{- $pullSecrets = append $pullSecrets . -}}
  {{- end -}}

  {{- if (not (empty $pullSecrets)) }}
imagePullSecrets:
    {{- range $pullSecrets }}
  - name: {{ . }}
    {{- end }}
  {{- end }}
{{- end -}}
