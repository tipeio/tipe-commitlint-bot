const lintCommits = require('../src/lint')

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
    },
    paginate: (fn, cb) => cb(fn),
    pullRequests: {
      getCommits: jest
        .fn()
        .mockReturnValueOnce({
          data: [{ sha: 'abcd', commit: { message: 'good: message' } }]
        })
        .mockReturnValue({
          data: [{ sha: 'abcde', commit: { message: 'bad message' } }]
        })
    }
  },
  repo: jest.fn(),
  issue: jest
    .fn()
    .mockReturnValue({ number: 14, owner: 'oliviaoddo', repo: 'test' })
}
describe('The wip function', () => {
  test('should return success', async () => {
    context.payload.pull_request.title = 'I am Wip'
    const response = await lintCommits(context)
    expect(response).toEqual({
      state: 'success',
      errSum: `Found 0 problems, and 0 warnings.`,
      emojiStatus: '✅',
      report: { valid: true, commits: [] }
    })
  })
  test('should return failure', async () => {
    context.payload.pull_request.title = 'best pr'
    const response = await lintCommits(context)
    expect(response).toEqual({
      state: 'failure',
      errSum: `Found 2 problems, and 0 warnings.`,
      emojiStatus: '❌',
      report: {
        valid: false,
        commits: [
          {
            errors: [
              {
                level: 2,
                message: 'message may not be empty',
                name: 'subject-empty',
                valid: false
              },
              {
                level: 2,
                message: 'type may not be empty',
                name: 'type-empty',
                valid: false
              }
            ],
            sha: 'abcde',
            warnings: []
          }
        ]
      }
    })
  })
})
