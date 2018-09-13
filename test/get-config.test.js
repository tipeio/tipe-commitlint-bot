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
  test('should return custom config', async () => {
    const github = { github: {
      repos: {
        getContent: jest.fn().mockResolvedValue({data: { content: 'bW9kdWxlLmV4cG9ydHMgPSB7fQ=='}})
      }
    }}
    const config = await getConfig({...context, ...github})
    expect.assertions(2)
    expect(config).toEqual(module.exports = {})
    expect(context.log.mock.calls.length).toBe(0);
  })
  test('should return default config for no custom config', async () => {
    const github = { github: {
      repos: {
        getContent: jest.fn().mockRejectedValue(404)
      }
    }}
    context.log.mockReset();
    const config = await getConfig({...context, ...github})
    expect.assertions(2)
    expect(config).toEqual(require('../src/commitlint.config'))
    expect(context.log.mock.calls[0][0]).toEqual('Using default config')
  })
  test('should return default config if extends exists', async () => {
    const github = { github: {
      repos: {
        getContent: jest.fn().mockResolvedValue({data: { content: 'bW9kdWxlLmV4cG9ydHMgPSB7CmV4dGVuZHM6IFsnQGNvbW1pdGxpbnQvYW5ndWxhciddCn0='}})
      }
    }}
    const config = await getConfig({...context, ...github})
    expect.assertions(2)
    expect(config).toEqual(require('../src/commitlint.config'))
    expect(context.log.mock.calls[0][0]).toEqual('Extends not supported, using default config.')
  })
})