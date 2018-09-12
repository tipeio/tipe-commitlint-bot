async function createCheck(
  context,
  finalState,
  message,
  lintStatus = { description: 'no lint status provided' },
  wipStatus = { description: 'no wip status provided' }
) {
  const pr = context.payload.pull_request

  try {
    await context.github.checks.create(
      context.repo({
        name: 'TipeCat',
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
  } catch (error) {
    if (error.code === 403) {
      context.log.warn('resource not accessible, creating status instead')
      // create status if creating check fails
      const params = {
        sha: pr.head.sha,
        context: 'TipeCat',
        state: finalState,
        description: `Lint: ${lintStatus.description}. WIP: ${
          wipStatus.description
        }.`,
        target_url: 'https://github.com/tipecat'
      }
      return context.github.repos.createStatus(context.repo(params))
    }
  }
}

module.exports = createCheck
