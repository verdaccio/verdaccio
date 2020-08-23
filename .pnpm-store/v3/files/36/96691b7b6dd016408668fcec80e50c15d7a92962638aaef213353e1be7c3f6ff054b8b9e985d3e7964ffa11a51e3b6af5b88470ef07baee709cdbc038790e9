const path = require('path')
const JSON_BUMP_FILES = require('../../defaults').bumpFiles
const PLAIN_TEXT_BUMP_FILES = ['VERSION.txt', 'version.txt']

function getUpdaterByType (type) {
  try {
    return require(`./types/${type}`)
  } catch (e) {
    throw Error(`Unable to locate updated for provided type (${type}).`)
  }
}

function getUpdaterByFilename (filename) {
  if (JSON_BUMP_FILES.includes(path.basename(filename))) {
    return getUpdaterByType('json')
  }
  if (PLAIN_TEXT_BUMP_FILES.includes(filename)) {
    return getUpdaterByType('plain-text')
  }
  throw Error(
    `Unsupported file (${filename}) provided for bumping.\n Please specifcy the updater \`type\` or use a custom \`updater\`.`
  )
}

function getCustomUpdater (updater) {
  return require(path.resolve(process.cwd(), updater))
}

module.exports.resolveUpdaterObjectFromArgument = function (arg) {
  /**
   * If an Object was not provided, we assume it's the path/filename
   * of the updater.
   */
  let updater = arg
  if (typeof updater !== 'object') {
    updater = {
      filename: arg
    }
  }
  try {
    if (updater.updater) {
      updater.updater = getCustomUpdater(updater.updater)
    } else if (updater.type) {
      updater.updater = getUpdaterByType(updater.type)
    } else {
      updater.updater = getUpdaterByFilename(updater.filename)
    }
  } catch (err) {
    if (err.code !== 'ENOENT') console.warn(err.message)
  }
  /**
   * We weren't able to resolve an updater for the argument.
   */
  if (!updater.updater) {
    return false
  }

  return updater
}
