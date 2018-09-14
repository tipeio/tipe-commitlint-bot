const handlePRChange = require('./src/handle-pr-change')
const handleCreateEvent = require('./src/handle-create-event')

module.exports = app => {
  // For more information on building apps:
  // https://probot.github.io/docs/
  const prEvents = [
    'pull_request.opened',
    'pull_request.edited',
    'pull_request.synchronize'
  ]
  app.on(prEvents, handlePRChange)
  app.on('create', handleCreateEvent)
}
