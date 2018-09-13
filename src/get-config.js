const defaultConfig = require('./commitlint.config.js')
const atob = require('atob');



async function getConfig(context){
  const { pull_request: pr } = context.payload
  const params = {
    path: 'commitlint.config.json',
    ref: pr.head.ref
  }

  let decodedCustomConfig;
  // check if pr contains custom config file
  try {
    const customConfig = await context.github.repos.getContent(context.repo(params))
    decodedCustomConfig = JSON.parse(atob(customConfig.data.content))
  } catch (e) {
    context.log('Using default config')
    return defaultConfig;
  }

  if(decodedCustomConfig.extends){
    context.log('Extends not supported, using default config.')
    return defaultConfig;
  }

  return decodedCustomConfig

}

module.exports = getConfig