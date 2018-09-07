const lintCommits = require('./lint')
const checkWIP = require('./wip')
const format = require('./format')
const createCheck = require('./createCheck')

async function handlePRChange(context) {
  const lintStatus = await lintCommits(context)
  const wipStatus = await checkWIP(context)
  const message = format(lintStatus, wipStatus)

  let finalState = 'success'
  if (lintStatus.state === 'failure' || wipStatus.state === 'failure') {
    finalState = 'failure'
  }

  await createCheck(context, finalState, message, lintStatus, wipStatus)
}

module.exports = handlePRChange
