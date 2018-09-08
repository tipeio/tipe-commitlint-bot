const format = require('../src/format')

const lintStatus = {
  report: {
    commits: []
  },
  emojiStatus: '✅',
  errSum: `Found 2problems, and 0 warnings.`
}

const wipStatus = {
  description: 'Work in progress!',
  emojiStatus: '❌'
}

describe('The format function', () => {
  test('replaces placeholders', () => {
    expect(format(lintStatus, wipStatus)).not.toMatch(/COMMITS_PLACEHOLDER/)
    expect(format(lintStatus, wipStatus)).not.toMatch(/COMMIT_LINT_STATUS/)
    expect(format(lintStatus, wipStatus)).not.toMatch(/COMMIT_ERR_SUM/)
    expect(format(lintStatus, wipStatus)).not.toMatch(/WIP_STATUS/)
    expect(format(lintStatus, wipStatus)).not.toMatch(/WIP_PLACEHOLDER/)
  })

  test('generates comment body', () => {
    // #1
    lintStatus.report.commits = [
      {
        sha: 'abc',
        errors: [],
        warnings: [{ message: 'warning message' }]
      }
    ]
    expect(format(lintStatus, wipStatus)).toMatch(/Commit: abc/)
    expect(format(lintStatus, wipStatus)).toMatch(/warning message/)
    // #2
    lintStatus.report.commits = [
      {
        sha: 'def',
        errors: [{ message: 'error message' }],
        warnings: [{ message: 'warning message' }]
      }
    ]
    expect(format(lintStatus, wipStatus)).toMatch(/Commit: def/)
    expect(format(lintStatus, wipStatus)).toMatch(/error message/)
    expect(format(lintStatus, wipStatus)).toMatch(/warning message/)
  })
})
