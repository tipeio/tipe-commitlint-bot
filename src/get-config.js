const defaultConfig = require('./commitlint-custom.config.js')
const Base64 = require('js-base64').Base64;

async function getConfig(context){
  const { pull_request: pr } = context.payload
  const params = {
    path: 'commitlint.config.js',
    ref: pr.head.ref
  }

  // check if pr contains custom config file
  try {
    const customConfig = await context.github.repos.getContent(context.repo(params))
    const decoded = Base64.decode(customConfig.data.content);
  } catch (e) {
    context.log('Using default config')
    return defaultConfig;
  }

  if(decoded.extends){
    context.log('Extends not supported, using default config.')
    return defaultConfig;
  }

  return decoded

}

module.exports = getConfig