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
        getContent: jest.fn().mockResolvedValue({data: { content: 'ewogICJydWxlcyI6IHsgImhlYWRlci1tYXgtbGVuZ3RoIjogWzIsICJhbHdheXMiLCAyXX0KfQ=='}})
      }
    }}
    const config = await getConfig({...context, ...github})
    expect.assertions(2)
    expect(config).toEqual({
      "rules": { "header-max-length": [2, "always", 2]}
    })
    expect(context.log.mock.calls.length).toBe(0);
  })
  test('should return default config if extends exists', async () => {
    const githubThree = { github: {
      repos: {
        getContent: jest.fn().mockResolvedValue({data: { content: 'ewogICJleHRlbmRzIjogIlsnQGNvbW1pdGxpbnQvQGFuZ3VhbHJdIgoKfQ=='}})
      }
    }}
    context.log.mockReset();
    const config = await getConfig({...context, ...githubThree})
    expect.assertions(2)
    expect(config).toEqual(require('../src/commitlint.config'))
    expect(context.log.mock.calls[0][0]).toEqual('Extends not supported, using default config.')
  })
  test('should return default config for no custom config', async () => {
    const githubTwo = { github: {
      repos: {
        getContent: jest.fn().mockRejectedValue(404)
      }
    }}
    context.log.mockReset();
    const config = await getConfig({...context, ...githubTwo})
    expect.assertions(2)
    expect(config).toEqual(require('../src/commitlint.config'))
    expect(context.log.mock.calls[0][0]).toEqual('Using default config')
  })
})