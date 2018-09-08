const checkWIP = require('../src/wip')

const context = {
  payload: {
    pull_request: {
      head: {
        sha: '9d3adf3c6fdca6c2df2467d35b30d6e5a47bc817'
      }
    }
  },
  github: {
    repos: {
      getCombinedStatusForRef: jest
        .fn()
        .mockReturnValue({ data: { statuses: [{ context: 'success' }] } })
    }
  },
  repo: jest.fn()
}
describe('The wip function', () => {
  test('should return work in progress', async () => {
    context.payload.pull_request.title = 'I am Wip'
    const response = await checkWIP(context)
    expect(response).toEqual({
      state: 'failure',
      description: 'Work in progress!',
      emojiStatus: '❌'
    })
  })
  test('should return ready for review', async () => {
    context.payload.pull_request.title = 'best pr'
    const response = await checkWIP(context)
    expect(response).toEqual({
      state: 'success',
      description: 'Ready for review!',
      emojiStatus: '✅'
    })
  })
  test('should return when the status has not changed', async () => {
    context.payload.pull_request.title = 'this is wip'
    context.github.repos.getCombinedStatusForRef = jest.fn().mockReturnValue({
      data: { statuses: [{ context: 'WIP', state: 'failure' }] }
    })
    const response = await checkWIP(context)

    expect(response).toBeUndefined()
  })
})
