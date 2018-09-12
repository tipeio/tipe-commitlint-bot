const fs = require('fs')
const path = require('path')

async function getConfig(context){
  const { pull_request: pr } = context.payload
  const params = {
    path: 'commitlint.config.js',
    ref: pr.head.ref
  }
  let config;

  // delete custom config file that may have been created by previous event
  try {
    fs.unlinkSync('src/commitlint-custom.config.js')
  } catch(e){
    context.log('Existing custom config not present')
  }

  // check if pr contains custom config file and write it to src
  try {
    const customConfig = await context.github.repos.getContent(context.repo(params))
    let buff = Buffer.from(customConfig.data.content, 'base64')
    fs.writeFileSync('src/commitlint-custom.config.js', buff)
  } catch (e) {
    context.log('Using default config')
  }

  if(fs.existsSync('src/commitlint-custom.config.js')){
    // delete require.cache[require.resolve('./commitlint-custom.config.js')]
    config = require('./commitlint-custom.config.js')

    if(config.extends){
      context.log('Extends not supported, using default config.')
      config = require('./commitlint.config.js')
    }  
  } else {
    config = require('./commitlint.config.js')
  }

  return config;

}

module.exports = getConfig