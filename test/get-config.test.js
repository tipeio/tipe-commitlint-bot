const fs = require('fs')
const getConfig = require('../src/get-config')

describe('Get Config', () => {
  const context = {
    payload: {
      pull_request: {
        head: {
          ref: 'jjsdfhsdfks_jdksfsd'
        }
      }
    },
    log: jest.fn(),
    repo: jest.fn()
  }
  beforeEach(() => {
    try {
      fs.unlinkSync('src/commitlint-custom.config.js')
    } catch(e){
      console.log('Custom config not present/deleted')
    }
  })
  test('should return custom config', async () => {
    const github = { github: {
      repos: {
        getContent: jest.fn().mockResolvedValue({data: { content: 'bW9kdWxlLmV4cG9ydHMgPSB7fQ=='}})
      }
    }}
    context.log.mockReset();
    const config = await getConfig({...context, ...github})
    // expect.assertions(4)
    // expect(config).toEqual(module.exports = {})
    expect(fs.existsSync('src/commitlint-custom.config.js')).toBeTruthy()
    expect(context.log.mock.calls[0][0]).toEqual('Existing custom config not present')
    expect(context.log.mock.calls.length).toBe(1);
  })
  test('should return default config for no custom config', async () => {
    const github = { github: {
      repos: {
        getContent: jest.fn().mockRejectedValue(404)
      }
    }}
    context.log.mockReset();
    const config = await getConfig({...context, ...github})
    expect.assertions(4)
    expect(config).toEqual(require('../src/commitlint.config'))
    expect(fs.existsSync('src/commitlint-custom.config.js')).toBeFalsy()
    expect(context.log.mock.calls[0][0]).toEqual('Existing custom config not present')
    expect(context.log.mock.calls[1][0]).toEqual('Using default config')
  })
  test.skip('should return default config if extends exists', async () => {
    const github = { github: {
      repos: {
        getContent: jest.fn().mockResolvedValue({data: { content: 'bW9kdWxlLmV4cG9ydHMgPSB7CmV4dGVuZHM6IFsnQGNvbW1pdGxpbnQvYW5ndWxhciddCn0='}})
      }
    }}
    const config = await getConfig({...context, ...github})
    expect.assertions(4)
    expect(config).toEqual(require('../src/commitlint.config'))
    expect(fs.existsSync('src/commitlint-custom.config.js')).toBeTruthy()
    expect(context.log.mock.calls[0][0]).toEqual('Existing custom config not present')
    expect(context.log.mock.calls[1][0]).toEqual('Extends not supported, using default config.')
  })
})