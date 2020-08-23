'use strict'

describe('Unit testing CLI', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  test('should only invoke one strategy if more than one exists', () => {
    jest.doMock('../src/strategies.js', () => {
      return {
        executeStrategy: jest.fn(() => {
          return 0
        }),
        isExecutableAvailableInPath: jest.fn(() => {
          return true
        })
      }
    })
    const strategies = require('../src/strategies')
    const cli = require('../src/cli')

    const executableStrategies = [
      {
        type: 'ls',
        filePath: 'ls'
      },
      {
        type: 'ls',
        filePath: 'ls'
      }
    ]

    const result = cli.start(executableStrategies)
    expect(result.strategiesInvoked).toEqual(true)
    expect(strategies.executeStrategy.mock.calls.length).toBe(1)
  })
})
