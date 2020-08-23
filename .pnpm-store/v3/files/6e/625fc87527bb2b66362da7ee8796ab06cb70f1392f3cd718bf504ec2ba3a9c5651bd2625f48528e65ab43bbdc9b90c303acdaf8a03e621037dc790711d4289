'use strict';

const xml = require('xml');
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');

const buildJsonResults = require('./utils/buildJsonResults');
const getOptions = require('./utils/getOptions');

// Store console results from onTestResult to later
// append to result
const consoleBuffer = {};

const processor = (report, reporterOptions = {}, jestRootDir = null) => {
  // If jest-junit is used as a reporter allow for reporter options
  // to be used. Env and package.json will override.
  const options = getOptions.options(reporterOptions);

  report.testResults.forEach((t, i) => {
    t.console = consoleBuffer[t.testFilePath];
  });

  const jsonResults = buildJsonResults(report, fs.realpathSync(process.cwd()), options);

  // Set output to use new outputDirectory and fallback on original output
  const outputName = (options.uniqueOutputName === 'true') ? getOptions.getUniqueOutputName() : options.outputName
  const output = path.join(options.outputDirectory, outputName);

  const finalOutput = getOptions.replaceRootDirInOutput(jestRootDir, output);

  // Ensure output path exists
  mkdirp.sync(path.dirname(finalOutput));

  // Write data to file
  fs.writeFileSync(finalOutput, xml(jsonResults, { indent: '  ', declaration: true }));

  // Jest 18 compatibility
  return report;
};

/*
  At the end of ALL of the test suites this method is called
  It's responsible for generating a single junit.xml file which
  Represents the status of the test runs

  Expected input and workflow documentation here:
  https://facebook.github.io/jest/docs/configuration.html#testresultsprocessor-string

  Intended output (junit XML) documentation here:
  http://help.catchsoftware.com/display/ET/JUnit+Format
*/

// This is an old school "class" in order
// for the constructor to be invoked statically and via "new"
// so we can support both testResultsProcessor and reporters
// TODO: refactor to es6 class after testResultsProcessor support is removed
function JestJUnit (globalConfig, options) {
  // See if constructor was invoked statically
  // which indicates jest-junit was invoked as a testResultsProcessor
  // and show deprecation warning

  if (globalConfig.hasOwnProperty('testResults')) {
    const newConfig = JSON.stringify({
      reporters: ['jest-junit']
    }, null, 2);

    return processor(globalConfig);
  }

  this._globalConfig = globalConfig;
  this._options = options;

  this.onTestResult = (test, testResult, aggregatedResult) => {
    if (testResult.console && testResult.console.length > 0) {
      consoleBuffer[testResult.testFilePath] = testResult.console;
    }
  };

  this.onRunComplete = (contexts, results) => {
    processor(results, this._options, this._globalConfig.rootDir);
  };
}

module.exports = JestJUnit;
