const template = `
There were the following issues with this Pull Request

<PLACEHOLDER>

You may need to [change the commit messages][ref] to comply with the \
repository contributing guidelines.

--------

🐱 This comment was generated by [**tipecat[bot]**][repo]. Please report \
issues [here][issues].

Happy coding!

[ref]: https://help.github.com/articles/changing-a-commit-message/
[repo]: https://github.com/tipeio/tipe-commitlint-bot
[issues]: https://github.com/tipeio/tipe-commitlint-bot/issues
`

function format(commits) {
  let message = ''

  commits.forEach(c => {
    message += `* Commit: ${c.sha}\n`
    message += c.errors.map(e => `  - ✖ ${e.message}\n`).join('')
    message += c.warnings.map(w => `  - ⚠ ${w.message}\n`).join('')
  })

  return template.replace('<PLACEHOLDER>', message)
}

module.exports = format
