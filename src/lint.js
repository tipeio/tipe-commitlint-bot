const fs = require('fs')
const { lint, load } = require('@commitlint/core')

// paginate all pr commits
async function lintCommits(context) {
  const pull = context.issue()
  const { pull_request: pr } = context.payload
  const { paginate, pullRequests} = context.github
  const params = {
    path: 'commitlint.config.js',
    ref: pr.head.ref
  }
  let lintStatus
  let config;

  // delete custom config file that may have been created by previous event
  try {
    fs.unlinkSync('src/commitlint-custom.config.js')
  } catch(e){
    context.log('Existing custom config not present')
  }

  // check if pr contains custom config file and write it to src
  try {
    const customConfig = await context.github.repos.getContent(context.repo(params))
    let buff = Buffer.from(customConfig.data.content, 'base64')
    fs.writeFileSync('src/commitlint-custom.config.js', buff)
  } catch (e) {
    context.log('using default config')
  }

  try {
    config = require('./commitlint-custom.config.js')

  } catch (e) {
    config = require('./commitlint.config.js')

  }

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
      report,
      emojiStatus: report.valid ? '✅' : '❌',
      errSum: `Found ${errorCount} problems, and ${warningCount} warnings.`
    }
  })

  return lintStatus
}

module.exports = lintCommits
