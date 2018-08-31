const { lint, load } = require('@commitlint/core')

const config = require('./config')
const format = require('./format')
const checkComments = require('./comments')

// paginate all pr commits
async function lintCommits(context) {
  const pull = context.issue()
  const { paginate, issues, pullRequests } = context.github
  let lintStatus

  await paginate(pullRequests.getCommits(pull), async ({ data }) => {
    // create an empty summary
    const report = { valid: true, commits: [] }
    const { rules } = await load(config)
    // error and warning counters
    let errorCount = 0
    let warningCount = 0

    // loop through all of the commits
    for (var d of data) {
      const { valid, errors, warnings } = await lint(d.commit.message, rules)
      if (!valid) {
        report.valid = false
      }

      if (errors.length > 0 || warnings.length > 0) {
        errorCount += errors.length
        warningCount += warnings.length

        report.commits.push({ sha: d.sha, errors, warnings })
      }
    }

    // create the final status
    lintStatus = {
      state: report.valid ? 'success' : 'failure',
      description: `found ${errorCount} problems, ${warningCount} warnings`
    }

    // get any previous bot comments
    const comment = await checkComments(issues, pull)

    // write comment with details
    if (errorCount > 0 || warningCount > 0) {
      const message = format(report.commits)
      if (comment) {
        await issues.editComment({ ...pull, id: comment.id, body: message })
      } else {
        // create a new bot comment
        await issues.createComment({ ...pull, body: message })
      }
    } else {
      if (comment) {
        // delete old bot comment if there are no issues
        await issues.deleteComment({ ...pull, commend_id: comment.id })
      }
    }
  })

  return lintStatus
}

module.exports = lintCommits
