const getCommit = require('../src/get-commit')

describe('Get Commit', () => {
  test('get commit request succeeds', async () => {
    const api = {
      repos: {
        getCommit: jest.fn().mockResolvedValue({
          data: {
            files: [{
              filename: 'filename',
              patch: 'patch',
              blob_url: 'https://github.com/Techforchange/first-timers-test/blob/f00ecb1bbffe515500558568ae0b176d2a1defe8/docs/README.md'
            }],
            commit: {
              message: 'message'
            },
            author: {
              login: 'username'
            }
          }
        })
      }
    }
  
    const state = {
      api,
      debug: jest.fn(),
      owner: 'owner',
      installRepo: 'installRepo',
      sha: 'sha',
      repoDefaultBranch: 'defaultBranch'
  
    }
  
    await getCommit(state)
    expect(api.repos.getCommit.mock.calls[0][0].owner).toBe('owner')
    expect(api.repos.getCommit.mock.calls[0][0].repo).toBe('installRepo')
    expect(api.repos.getCommit.mock.calls[0][0].sha).toBe('sha')
    expect(state.commit.message).toBe('message')
    expect(state.commit.filename).toBe('filename')
    expect(state.commit.patch).toBe('patch')
    expect(state.commit.branchUrl).toBe('https://github.com/Techforchange/first-timers-test/blob/defaultBranch/docs/README.md')
    expect(state.commit.authorLogin).toBe('username')

  })
  
  test('get commit fails', async () => {
    const api = {
      repos: {
        getCommit: jest.fn().mockRejectedValue({code: 404})
      }
    }
  
    const state = {
      api,
      debug: jest.fn()
    }

    await expect(getCommit(state)).rejects.toEqual({code: 404})
  })
})
