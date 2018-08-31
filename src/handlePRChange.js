const lintCommits = require('./lint')
const checkWIP = require('./wip')

async function handlePRChange(context) {
  // get info from context
  const { sha } = context.payload.pull_request.head
  const repo = context.repo()

  // github api
  const { repos } = context.github

  // save pr info
  const statusInfo = { ...repo, sha, context: 'Tipe Cat' }

  // create pending status while commits are looked through
  await repos.createStatus({
    ...statusInfo,
    state: 'pending',
    description: 'Waiting for the status to be reported'
  })

  const lintStatus = await lintCommits(context)
  const wipStatus = await checkWIP(context)

  let finalState
  if (lintStatus.state === 'failure') {
    finalState = 'failure'
  } else if (wipStatus.state === 'pending') {
    finalState = 'pending'
  } else {
    finalState = 'success'
  }
  await repos.createStatus({
    ...statusInfo,
    state: finalState,
    description: `Lint: ${lintStatus.description}. WIP: ${
      wipStatus.description
    }.`
  })
}

module.exports = handlePRChange
