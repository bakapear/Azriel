let fs = require('fs')

module.exports = {
  readJSON (path) {
    return JSON.parse(fs.readFileSync(path))
  }
}
