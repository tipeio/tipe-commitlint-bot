const lintCommits = require('./lint')
const checkWIP = require('./wip')
const format = require('./format')
const createCheck = require('./createCheck')
const fs = require('fs')

async function handlePRChange(context) {
  const pr = context.payload.pull_request

  const params = {
    path: 'commitlint.config.js',
    ref: pr.head.ref
  }

  try {
    const config = await context.github.repos.getContent(context.repo(params))
    let buff = Buffer.from(config.data.content, 'base64')
    fs.writeFileSync('src/commitlint.config.js', buff)
  } catch (e) {
    console.log('using default config')
  }

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
