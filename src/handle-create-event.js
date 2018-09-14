const readFileSync = require('fs').readFileSync
const pathResolve = require('path').resolve

const getBranch = require('./get-branch')
const getCommit = require('./get-commit')
const createIssue = require('./create-issue')
const getTemplateContent = require('./get-template-content')
const deleteBranch = require('./delete-branch')

const template = readFileSync(
  pathResolve(__dirname, '..', 'instructions.md'),
  'utf8'
)

async function handleCreateEvent(context) {
  const { ref, ref_type: refType, repository } = context.payload
  const config = await context.config('first-timers.yml', {labels: ['first-tipers-only'], repository: repository.name})
  const debugMessage = `probot:first-timers:${repository.full_name.toLowerCase()}`
  context.log.debug({data: debugMessage}, `webhook received for ${refType} "${ref}"`)

  // run only for newly created branches that start with "first-timers-"
  if (refType !== 'branch') {
    context.log.debug({data: debugMessage}, 'ignoring: not a branch')
    return
  }
  if (!/^first-tipers-/.test(ref)) {
    context.log.debug({data: debugMessage}, `ignoring: "${ref}" does not match /^first-tipers-/`)
    return
  }

  const state = {
    api: context.github,
    debug: (message) => context.log.debug({data: debugMessage}, message),
    owner: repository.owner.login,
    installRepo: repository.name,
    branch: ref,
    template,
    labels: config.labels,
    sha: null,
    repoDefaultBranch: repository.default_branch,
    customTemplateUrl: config.template,
    issueRepo: config.repository
  }

  return getBranch(state)
    .then(getTemplateContent)
    .then(getCommit)
    .then(createIssue)
    .then(deleteBranch)
    .catch(err => {
      // log
      return Promise.reject(err)
    })
}


module.exports = handleCreateEvent
