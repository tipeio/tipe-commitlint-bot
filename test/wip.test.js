const wip = require('../src/wip')

describe('The wip function', () => {
  test('repalces placeholder', () => {
    expect(format(commits[0])).not.toMatch(/PLACEHOLDER/)
  })
})
