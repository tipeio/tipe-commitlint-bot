const openedPr = require('./pull_request.opened.json')
const synchronizePr = require('./pull_request.synchronize.json')
const checkRunFail = require('./check_run_created_failure.json')
const checkRunSuccess = require('./check_run_created_success.json')

module.exports = { openedPr, synchronizePr, checkRunFail, checkRunSuccess }
