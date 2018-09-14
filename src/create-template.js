function createTemplate(template, installRepo, patch, filename, branchUrl, authorLogin) {
  return  template.replace(/\$DIFF/, patch)
  .replace(/\$FILENAME/, filename)
  .replace(/\$BRANCH_URL/, branchUrl)
  .replace(/\$REPO/, installRepo)
  .replace(/\$AUTHOR/, `@${authorLogin}`)
}

module.exports = createTemplate