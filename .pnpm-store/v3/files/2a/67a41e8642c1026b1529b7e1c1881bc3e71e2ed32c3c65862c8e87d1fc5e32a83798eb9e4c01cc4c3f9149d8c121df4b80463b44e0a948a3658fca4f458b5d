"use strict";

var _fs = require("fs");

var _path = require("path");

var _ = _interopRequireDefault(require("../"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ruleNames = Object.keys(_.default.rules);
const numberOfRules = 40;
describe('rules', () => {
  it('should have a corresponding doc for each rule', () => {
    ruleNames.forEach(rule => {
      const docPath = (0, _path.resolve)(__dirname, '../../docs/rules', `${rule}.md`);

      if (!(0, _fs.existsSync)(docPath)) {
        throw new Error(`Could not find documentation file for rule "${rule}" in path "${docPath}"`);
      }
    });
  });
  it('should have the correct amount of rules', () => {
    const {
      length
    } = ruleNames;

    if (length !== numberOfRules) {
      throw new Error(`There should be exactly ${numberOfRules} rules, but there are ${length}. If you've added a new rule, please update this number.`);
    }
  });
  it('should export configs that refer to actual rules', () => {
    const recommendedConfigs = _.default.configs;
    expect(recommendedConfigs).toMatchSnapshot();
    expect(Object.keys(recommendedConfigs)).toEqual(['all', 'recommended', 'style']);
    expect(Object.keys(recommendedConfigs.all.rules)).toHaveLength(ruleNames.length);
    const allConfigRules = Object.values(recommendedConfigs).map(config => Object.keys(config.rules)).reduce((previousValue, currentValue) => [...previousValue, ...currentValue]);
    allConfigRules.forEach(rule => {
      const ruleNamePrefix = 'jest/';
      const ruleName = rule.slice(ruleNamePrefix.length);
      expect(rule.startsWith(ruleNamePrefix)).toBe(true);
      expect(ruleNames).toContain(ruleName); // eslint-disable-next-line @typescript-eslint/no-require-imports

      expect(() => require(`../rules/${ruleName}`)).not.toThrow();
    });
  });
});