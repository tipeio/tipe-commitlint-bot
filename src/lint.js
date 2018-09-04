const { lint, load } = require('@commitlint/core')

const config = require('./config')

// paginate all pr commits
async function lintCommits(context) {
  const pull = context.issue()
  const { paginate, pullRequests } = context.github
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
    report.errSum = `Found ${errorCount} problems, and ${warningCount} warnings.`
    // create the final status
    lintStatus = {
      state: report.valid ? 'success' : 'failure',
      report
    }
  })

  return lintStatus
}

module.exports = lintCommits
