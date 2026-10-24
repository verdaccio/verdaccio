type TranslationTree = { [key: string]: unknown };

function countTranslated(source: TranslationTree, translation: TranslationTree | undefined) {
  let total = 0;
  let translated = 0;
  for (const [key, sourceValue] of Object.entries(source)) {
    const value = translation?.[key];
    if (typeof sourceValue === 'object' && sourceValue !== null) {
      const nested = countTranslated(
        sourceValue as TranslationTree,
        typeof value === 'object' && value !== null ? (value as TranslationTree) : undefined
      );
      total += nested.total;
      translated += nested.translated;
    } else {
      total += 1;
      if (typeof value === 'string' && value.length > 0) {
        translated += 1;
      }
    }
  }
  return { total, translated };
}

/** Percentage (0-100) of the source strings present in a translation; keys missing from the source are ignored. */
export function getTranslationProgress(
  source: TranslationTree,
  translation: TranslationTree | undefined
): number {
  const { total, translated } = countTranslated(source, translation);
  return total === 0 ? 0 : Math.floor((translated / total) * 100);
}
