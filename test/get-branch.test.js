const getBranch = require('../src/get-branch')
describe('Get Branch', () => {

test('get branch request succeeds', async () => {

const api = {
  repos: {
    getBranch: jest.fn().mockResolvedValue({
      data: {
        commit: {
          sha: 'sha'
        }
      }
    })
  }
}

  const state = {
    api,
    debug: () => {},
    owner: 'owner',
    installRepo: 'installRepo',
    branch: 'branch'
  }

  await getBranch(state)
  expect(state.sha).toBe('sha')
})

test('get branch test fails', async () => {

const api = {
  repos: {
    getBranch: jest.fn().mockRejectedValue({code: 404})
  }
}

  const state = {
    api,
    debug: () => {}
  }

  await expect(getBranch(state)).rejects.toEqual({code: 404})
})
})
