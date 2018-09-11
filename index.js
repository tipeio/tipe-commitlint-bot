const handlePRChange = require('./src/handle-pr-change')
const handleCreate = require('./src/handle-create')

module.exports = app => {
  // For more information on building apps:
  // https://probot.github.io/docs/
  app.on('pull_request.opened', handlePRChange)
  app.on('pull_request.edited', handlePRChange)
  app.on('pull_request.synchronize', handlePRChange)
}
