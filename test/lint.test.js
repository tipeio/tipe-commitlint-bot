// Packages
const { Application } = require('probot')
// Update necessary env vars
process.env.APP_NAME = 'tipecat-dev'

// Ours
const plugin = require('../index')
const events = require('./events')

const repo = { owner: 'user', repo: 'repo' }

let app, github

describe('the commit lint function', () => {
  beforeEach(() => {
    // Here we create a robot instance
    app = new Application()
    app.load(plugin)

    // Mock GitHub client
    github = {
      issues: {
        createComment: jest.fn(),
        editComment: jest.fn(),
        deleteComment: jest.fn(),
        getComments: jest.fn().mockReturnValue({
          data: [
            {
              id: 1,
              user: {
                login: `${process.env.APP_NAME}[bot]`,
                id: 2,
                type: 'Bot'
              }
            }
          ]
        })
      },
      repos: {
        createStatus: jest.fn(),
        getCombinedStatusForRef: jest.fn().mockRejectedValue({
          data: {
            statuses: [{}]
          }
        })
      },
      pullRequests: {
        getCommits: jest
          .fn()
          .mockReturnValueOnce({
            data: [{ sha: 'abcd', commit: { message: 'good: message' } }]
          })
          .mockReturnValue({
            data: [{ sha: 'abcd', commit: { message: 'bad message' } }]
          })
      },
      paginate: (fn, cb) => cb(fn)
    }
    // Passes the mocked out GitHub API into out robot instance
    app.auth = () => Promise.resolve(github)
  })

  test.skip('status update to pending', async () => {
    await app.receive(events.opened)
    expect(github.repos.createStatus).toHaveBeenCalledWith(
      expect.objectContaining({ state: 'pending' })
    )
  })

  test('fetching the list of commits', async () => {
    await app.receive(events.opened)
    expect(github.pullRequests.getCommits).toHaveBeenCalledWith(
      expect.objectContaining({ ...repo, number: 1 })
    )
  })

  test.skip('remove comment when no errors/warnings', async () => {
    await app.receive(events.opened)
    expect(github.issues.createComment).not.toHaveBeenCalled()
    expect(github.issues.editComment).not.toHaveBeenCalled()
    expect(github.issues.getComments).toHaveBeenCalled()
    expect(github.issues.deleteComment).toHaveBeenCalled()

    await app.receive(events.opened)
    expect(github.issues.editComment).toHaveBeenCalled()
    expect(github.issues.getComments).toHaveBeenCalled()
  })
})
