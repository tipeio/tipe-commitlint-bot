function getTemplateContent(state) {
  if (!state.customTemplateUrl) {
    return state
  }
  return state.api.repos
    .getContent({
      owner: state.owner,
      repo: state.issueRepo,
      path: state.customTemplateUrl
    })
    .then(function(result) {
      const content = Buffer.from(result.data.content, 'base64').toString()
      state.template = content
      return state
    })
}

module.exports = getTemplateContent
