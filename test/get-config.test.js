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
    repo: jest.fn()
  }
  test('should return custom config', async () => {
    const github = { github: {
      repos: {
        getContent: jest.fn().mockResolvedValue({data: { content: 'ewogICJydWxlcyI6IHsgImhlYWRlci1tYXgtbGVuZ3RoIjogWzIsICJhbHdheXMiLCAyXX0KfQ=='}})
      }
    }}
    const config = await getConfig({...context, ...github})
    expect(config).toEqual({
      "rules": { "header-max-length": [2, "always", 2]}
    })
  })
  test('should return default config if extends exists', async () => {
    const githubThree = { github: {
      repos: {
        getContent: jest.fn().mockResolvedValue({data: { content: 'ewogICJleHRlbmRzIjogIlsnQGNvbW1pdGxpbnQvQGFuZ3VhbHJdIgoKfQ=='}})
      }
    }}
    const config = await getConfig({...context, ...githubThree})
    expect(config).toEqual(require('../src/commitlint.config'))
  })
  test('should return default config for no custom config', async () => {
    const githubTwo = { github: {
      repos: {
        getContent: jest.fn().mockRejectedValue(404)
      }
    }}
    const config = await getConfig({...context, ...githubTwo})
    expect(config).toEqual(require('../src/commitlint.config'))
  })
})