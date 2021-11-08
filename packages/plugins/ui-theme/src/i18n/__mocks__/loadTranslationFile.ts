// we don't need real translations by running test
// it always returns english by default
export function loadTranslationFile() {
  return require(`../crowdin/ui.json`);
}
