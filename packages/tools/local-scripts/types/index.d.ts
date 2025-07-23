declare module '@verdaccio/local-scripts' {
  interface MonthlyDownloadEntry {
    downloads: number;
    start: string;
    end: string;
    package: string;
  }

  interface DockerPullEntry {
    pullCount: number;
    ipCount: number;
  }

  interface NpmjsDownloadsEntry {
    [version: string]: number;
  }

  interface YearlyDownloadsEntry {
    [year: string]: number;
  }

  interface TranslationProgress {
    translationProgress: number;
    approvalProgress: number;
  }

  interface ProgressLangEntry {
    [language: string]: TranslationProgress;
  }

  export const data: ProgressLangEntry;
  export const translationsData: ProgressLangEntry;
  export const npmjsDownloads: { [date: string]: NpmjsDownloadsEntry };
  export const dockerPulls: { [date: string]: DockerPullEntry };
  export const yearlyDownloads: YearlyDownloadsEntry;
  export const monthlyDownloads: MonthlyDownloadEntry[];
}
