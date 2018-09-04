async function checkWIP(context) {
  const { pull_request: pr } = context.payload
  const currentStatus = await getCurrentStatus(context)
  const isWip = containsWIP(pr.title)
  const newStatus = isWip ? 'failure' : 'success'
  // check to see if status has changed
  console.log(currentStatus, 'current status')
  const hasChanged = currentStatus !== newStatus

  if (!hasChanged) {
    return
  }

  const wipStatus = {
    state: newStatus,
    description: isWip ? 'Work in progress!' : 'Ready for review!'
  }

  return wipStatus
}

function containsWIP(title) {
  return /\b(wip|do not merge|work in progress)\b/i.test(title)
}

async function getCurrentStatus(context) {
  const {
    data: { statuses }
  } = await context.github.repos.getCombinedStatusForRef(
    context.repo({
      ref: context.payload.pull_request.head.sha
    })
  )

  return (statuses.find(status => status.context === 'WIP') || {}).state
}

module.exports = checkWIP
