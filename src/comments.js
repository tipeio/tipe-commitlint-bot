/**
 * Checks for a previous bot comment, if found returns the comment
 */
async function checkComments(issues, pull) {
  const comments = await issues.getComments(pull)
  return comments.data.find(
    comment => comment.user.login === process.env.APP_NAME + '[bot]'
  )
}

module.exports = checkComments
