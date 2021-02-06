export type Manifest = {
  // goes on first place at the header
  ico: string;
  css: string[];
  js: string[];
};

export function getManifestValue(manifestItems: string[], manifest): string[] {
  return manifestItems.map((item) => {
    return manifest[item];
  });
}
