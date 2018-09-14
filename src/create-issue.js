const createTemplate = require('./create-template')

function createIssue(state) {
  const { message, patch, filename, branchUrl, authorLogin } = state.commit
  const title = message.split('\n\n')[0]
  const content = createTemplate(state.template, state.installRepo, patch, filename, branchUrl, authorLogin)

  state.debug('creating issue...')

  return state.api.issues
    .create({
      owner: state.owner,
      repo: state.issueRepo,
      title,
      body: content,
      labels: state.labels
    })
    .then(result => {
      state.debug(`issue created: ${result.data.html_url}`)
      return state
    })
}

module.exports = createIssue
