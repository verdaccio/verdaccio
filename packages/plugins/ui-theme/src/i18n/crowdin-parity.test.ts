import coreTranslations from '../../../../core/i18n/src/crowdin/ui.json';
import themeTranslations from './crowdin/ui.json';

// Both files are uploaded to Crowdin as independent sources (see crowdin.yaml), but the
// bundled UI only ships the ui-theme copy while @verdaccio/ui-i18n consumers get the
// core copy. A key present in one and not the other renders as a raw i18n key.
function flattenKeys(node: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(node).flatMap(([key, value]) =>
    typeof value === 'object' && value !== null
      ? flattenKeys(value as Record<string, unknown>, `${prefix}${key}.`)
      : [`${prefix}${key}`]
  );
}

describe('crowdin translation sources', () => {
  test('ui-theme and @verdaccio/ui-i18n define the same keys', () => {
    const themeKeys = flattenKeys(themeTranslations).sort();
    const coreKeys = flattenKeys(coreTranslations).sort();
    expect(themeKeys).toEqual(coreKeys);
  });
});
