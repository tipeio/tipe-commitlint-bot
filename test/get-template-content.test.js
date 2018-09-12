const getTemplateContent = require('../src/get-template-content')

describe('Get Template Content', () => {
  
  test('gets template content if URL exists', async () => {
    const api = {
      repos: {
        getContent: jest.fn().mockResolvedValue({
          data: {
            content: 'Y29udGVudA=='
          }
        })
      }
    }
    const state = {
      api,
      debug: jest.fn(),
      owner: 'owner',
      issueRepo: 'issueRepo',
      customTemplateUrl: 'custom_url'
    }
  
    await getTemplateContent(state)
    expect(api.repos.getContent.mock.calls[0][0].owner).toEqual('owner')
    expect(api.repos.getContent.mock.calls[0][0].repo).toEqual('issueRepo')
    expect(api.repos.getContent.mock.calls[0][0].path).toEqual('custom_url')
    expect(state.template).toEqual('content')
  })
  
  test('does not get content if URL does not exist', async () => {
    const api = {
      repos: {
        getContent: jest.fn()
      }
    }
    const state = {
      api,
      debug: jest.fn(),
      owner: 'owner',
      issueRepo: 'issueRepo',
      customTemplateUrl: null
    }
  
    expect(getTemplateContent(state)).toBeUndefined()

  })
})
