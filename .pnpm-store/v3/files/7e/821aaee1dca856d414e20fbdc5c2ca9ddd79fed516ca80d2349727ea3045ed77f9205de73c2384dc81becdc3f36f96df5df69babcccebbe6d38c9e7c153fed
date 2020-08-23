[![Build Status](https://travis-ci.org/jest-community/jest-junit.svg?branch=master)](https://travis-ci.org/jest-community/jest-junit)

# jest-junit
A Jest reporter that creates compatible junit xml files

Note: as of jest-junit 11.0.0 NodeJS >= 10.12.0 is required.

## Installation
```shell
yarn add --dev jest-junit
```

## Usage
In your jest config add the following entry:
```JSON
{
  "reporters": [ "default", "jest-junit" ]
}
```

Then simply run:

```shell
jest
```

For your Continuous Integration you can simply do:
```shell
jest --ci --reporters=default --reporters=jest-junit
```

## Usage as testResultsProcessor
In your jest config add the following entry:
```JSON
{
  "testResultsProcessor": "jest-junit"
}
```

Then simply run:

```shell
jest
```

For your Continuous Integration you can simply do:
```shell
jest --ci --testResultsProcessor="jest-junit"
```

## Configuration

`jest-junit` offers several configurations based on environment variables or a `jest-junit` key defined in `package.json` or a reporter option.
Environment variable and package.json configuration should be **strings**.
Reporter options should also be strings exception for suiteNameTemplate, classNameTemplate, titleNameTemplate that can also accept a function returning a string.

| Environment Variable Name | Reporter Config Name| Description | Default | Possible Injection Values
|--|--|--|--|--|
| `JEST_SUITE_NAME` | `suiteName` | `name` attribute of `<testsuites>` | `"jest tests"` | N/A
| `JEST_JUNIT_OUTPUT_DIR` | `outputDirectory` | Directory to save the output. | `process.cwd()` | N/A
| `JEST_JUNIT_OUTPUT_NAME` | `outputName` | File name for the output. | `"junit.xml"` | N/A
| `JEST_JUNIT_UNIQUE_OUTPUT_NAME` | `uniqueOutputName` | Create unique file name for the output `junit-${uuid}.xml`, overrides `outputName` | `false` | N/A
| `JEST_JUNIT_SUITE_NAME` | `suiteNameTemplate` | Template string for `name` attribute of the `<testsuite>`. | `"{title}"` | `{title}`, `{filepath}`, `{filename}`, `{displayName}`
| `JEST_JUNIT_CLASSNAME` | `classNameTemplate` | Template string for the `classname` attribute of `<testcase>`. | `"{classname} {title}"` | `{classname}`, `{title}`, `{filepath}`, `{filename}`, `{displayName}`
| `JEST_JUNIT_TITLE` | `titleTemplate` | Template string for the `name` attribute of `<testcase>`. | `"{classname} {title}"` | `{classname}`, `{title}`, `{filepath}`, `{filename}`, `{displayName}`
| `JEST_JUNIT_ANCESTOR_SEPARATOR` | `ancestorSeparator` | Character(s) used to join the `describe` blocks. | `" "` | N/A
| `JEST_JUNIT_ADD_FILE_ATTRIBUTE` | `addFileAttribute` | Add file attribute to the output. This config is primarily for Circle CI. This setting provides richer details but may break on other CI platforms. Must be a string. | `"false"` | N/A
| `JEST_JUNIT_INCLUDE_CONSOLE_OUTPUT` | `includeConsoleOutput` | Adds console output to any testSuite that generates stdout during a test run. | `false` | N/A
| `JEST_JUNIT_INCLUDE_SHORT_CONSOLE_OUTPUT` | `includeShortConsoleOutput` | Adds short console output (only message value) to any testSuite that generates stdout during a test run. | `false` | N/A
| `JEST_USE_PATH_FOR_SUITE_NAME` | `usePathForSuiteName` | **DEPRECATED. Use `suiteNameTemplate` instead.** Use file path as the `name` attribute of `<testsuite>` | `"false"` | N/A


You can configure these options via the command line as seen below:

```shell
JEST_SUITE_NAME="Jest JUnit Unit Tests" JEST_JUNIT_OUTPUT_DIR="./artifacts" jest
```

Or you can also define a `jest-junit` key in your `package.json`.  All are **string** values.

```
{
  ...
  "jest-junit": {
    "suiteName": "jest tests",
    "outputDirectory": ".",
    "outputName": "junit.xml",
    "uniqueOutputName": "false",
    "classNameTemplate": "{classname}-{title}",
    "titleTemplate": "{classname}-{title}",
    "ancestorSeparator": " › ",
    "usePathForSuiteName": "true"
  }
}
```

Or you can define your options in your reporter configuration.

```js
// jest.config.js
{
	reporters: [
      "default",
    	[ "jest-junit", { suiteName: "jest tests" } ]
  ]
}
```


### Configuration Precedence
If using the `usePathForSuiteName` and `suiteNameTemplate`, the `usePathForSuiteName` value will take precedence. ie: if `usePathForSuiteName=true` and `suiteNameTemplate="{filename}"`, the filepath will be used as the `name` attribute of the `<testsuite>` in the rendered `jest-junit.xml`).

### Examples

Below are some example configuration values and the rendered `.xml` to created by `jest-junit`.

The following test defined in the file `/__tests__/addition.test.js` will be used for all examples:
```js
describe('addition', () => {
  describe('positive numbers', () => {
    it('should add up', () => {
      expect(1 + 2).toBe(3);
    });
  });
});
```

#### Example 1
The default output:

```xml
<testsuites name="jest tests">
  <testsuite name="addition" tests="1" errors="0" failures="0" skipped="0" timestamp="2017-07-13T09:42:28" time="0.161">
    <testcase classname="addition positive numbers should add up" name="addition positive numbers should add up" time="0.004">
    </testcase>
  </testsuite>
</testsuites>
```

#### Example 2
Using the `classNameTemplate` and `titleTemplate`:

```shell
JEST_JUNIT_CLASSNAME="{classname}" JEST_JUNIT_TITLE="{title}" jest
```

renders

```xml
<testsuites name="jest tests">
  <testsuite name="addition" tests="1" errors="0" failures="0" skipped="0" timestamp="2017-07-13T09:45:42" time="0.154">
    <testcase classname="addition positive numbers" name="should add up" time="0.005">
    </testcase>
  </testsuite>
</testsuites>
```

#### Example 3
Using the `ancestorSeparator`:

```shell
JEST_JUNIT_ANCESTOR_SEPARATOR=" › " jest
```
renders

```xml
<testsuites name="jest tests">
  <testsuite name="addition" tests="1" errors="0" failures="0" skipped="0" timestamp="2017-07-13T09:47:12" time="0.162">
    <testcase classname="addition › positive numbers should add up" name="addition › positive numbers should add up" time="0.004">
    </testcase>
  </testsuite>
</testsuites>
```

#### Example 4
Using the `suiteNameTemplate`:

```shell
JEST_JUNIT_SUITE_NAME ="{filename}" jest
```

```xml
<testsuites name="jest tests">
  <testsuite name="addition.test.js" tests="1" errors="0" failures="0" skipped="0" timestamp="2017-07-13T09:42:28" time="0.161">
    <testcase classname="addition positive numbers should add up" name="addition positive numbers should add up" time="0.004">
    </testcase>
  </testsuite>
</testsuites>
```


#### Example 5
Using `classNameTemplate` as a function in reporter options

```js
// jest.config.js
{
  reporters: [
    "default",
      [
        "jest-junit",
        {
          classNameTemplate: (vars) => {
            return vars.classname.toUpperCase();
          }
        }
      ]
  ]
}
```

renders

```xml
<testsuites name="jest tests">
  <testsuite name="addition" tests="1" errors="0" failures="0" skipped="0" timestamp="2017-07-13T09:42:28" time="0.161">
    <testcase classname="ADDITION POSITIVE NUMBERS" name="addition positive numbers should add up" time="0.004">
    </testcase>
  </testsuite>
</testsuites>
```

#### Adding custom testsuite properties
New feature as of jest-junit 11.0.0!

Create a file in your project root directory named junitProperties.js:
```js
module.exports = () => {
    return {
       key: "value"
    }
});
```

Will render
```xml
<testsuites name="jest tests">
  <testsuite name="addition" tests="1" errors="0" failures="0" skipped="0" timestamp="2017-07-13T09:42:28" time="0.161">
    <properties>
        <property name="key" value="value" />
    </properties>
    <testcase classname="addition positive numbers should add up" name="addition positive numbers should add up" time="0.004">
    </testcase>
  </testsuite>
</testsuites>
```
