const lintCommits = require('./lint')
const checkWIP = require('./wip')
const format = require('./format')

async function handlePRChange(context) {
  const lintStatus = await lintCommits(context)
  const wipStatus = await checkWIP(context)
  const pr = context.payload.pull_request
  const message = format(lintStatus.report, wipStatus.description)

  let finalState = 'success'
  if (lintStatus.state === 'failure' || wipStatus.state === 'failure') {
    finalState = 'failure'
  }

  context.github.checks
    .create(
      context.repo({
        name: 'Tipe Cat',
        head_branch: pr.head.ref,
        head_sha: pr.head.sha,
        status: 'completed',
        conclusion: finalState,
        completed_at: new Date(),
        output: {
          title: 'TipeCat',
          summary: message
        }
      })
    )
    .catch(function checkFails(error) {
      if (error.code === 403) {
        console.log('resource not accessible, creating status instead')
        // create status if creating check fails
        const params = {
          sha: pr.head.sha,
          context: 'Tipe Cat',
          state: finalState,
          description: `Lint: ${lintStatus.description}. WIP: ${
            wipStatus.description
          }.`,
          target_url: 'https://github.com/tipecat'
        }
        return context.github.repos.createStatus(context.repo(params))
      }
    })
}

module.exports = handlePRChange
