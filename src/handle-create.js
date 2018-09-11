const readFileSync = require('fs').readFileSync
const pathResolve = require('path').resolve

const getDebug = require('debug')

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
  console.log(context.config.toString())
  const config = await context.config(
    'config.yml'
  )
  console.log(config, "CONFIG")
  const debug = getDebug(
    `probot:first-timers:${repository.full_name.toLowerCase()}`
  )
  debug(`webhook received for ${refType} "${ref}"`)

  // run only for newly created branches that start with "first-timers-"
  if (refType !== 'branch') {
    debug('ignoring: not a branch')
    return
  }
  if (!/^first-timers-/.test(ref)) {
    debug(`ignoring: "${ref}" does not match /^first-timers-/`)
    return
  }

  const state = {
    api: context.github,
    debug,
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
    .then(getTemplateContent.bind(null, state))
    .then(getCommit.bind(null, state))
    .then(createIssue.bind(null, state))
    .then(deleteBranch.bind(null, state))
    .catch(error => {
      debug(error.toString())
    })
}

module.exports = handleCreateEvent
