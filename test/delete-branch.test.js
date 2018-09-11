const deleteBranch = require('../src/delete-branch')

describe('Delete Branch', () => {
  test('delete branch request succeeds', async () => {
    const api = {
      gitdata: {
        deleteReference: jest.fn().mockResolvedValue({ meta: {
          status: '204 No Content'
        }})
      }
    }
  
    const state = {
      api,
      debug: jest.fn(),
      owner: 'owner',
      branch: 'branch',
      installRepo: 'installRepo'
    }
  
    const response = await deleteBranch(state)
    expect(response.meta.status).toEqual('204 No Content')
  })
  
  test('delete branch request fails 403', async () => {
    const api = {
      gitdata: {
        deleteReference: jest.fn().mockRejectedValue({ code: 403 })
      }
    }
    const state = {
      api,
      debug: jest.fn(),
      owner: 'owner',
      branch: 'branch',
      repo: null
    }
    const response = await deleteBranch(state)
    expect(response.code).toBe(403)
  })
  
  
  test('delete branch request fails 404', async () => {
    const api = {
      gitdata: {
        deleteReference: jest.fn().mockRejectedValue({ code: 404 })
      }
    }
    const state = {
      api,
      debug: jest.fn(),
      owner: 'owner',
      branch: 'branch',
      repo: null
    }
  
    const response = await deleteBranch(state)
    expect(response.code).toBe(404)
  })
})
