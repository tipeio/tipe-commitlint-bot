function deleteBranch(state) {
  const ref = `heads/${state.branch}`
  return state.api.gitdata
    .deleteReference({
      owner: state.owner,
      repo: state.installRepo,
      ref
    })
    .then(result => {
      state.debug(`branch deleted: ${ref}`)
      return state
    })
    .catch(err => {
      if (err.code === 403) {
        state.debug(
          `could not delete "${
            state.branch
          }" branch, lacking permission for owner "${state.owner}"`
        )
      }
      else {
        state.debug(err.toString())
      }
      return err
    })
}

module.exports = deleteBranch
