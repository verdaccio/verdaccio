const fs = require('fs')

module.exports = function (args, filePath, content) {
  if (args.dryRun) return
  fs.writeFileSync(filePath, content, 'utf8')
}
