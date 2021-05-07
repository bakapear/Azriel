let ph = require('path')
let fs = require('fs')

module.exports = {
  loadEnv (path) {
    if (!fs.existsSync(path)) return process.env
    let file = fs.readFileSync(path, 'utf-8')
    let lines = file.split(/\r?\n/)
    return lines.reduce((acc, item) => {
      let parts = item.split('=')
      acc[parts.shift()] = parts.join('=')
      return acc
    }, {})
  }
}
