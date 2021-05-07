let ph = require('path')
let fs = require('fs')

let mods = ['handler', 'util', 'gadgets']

mods.reduce((acc, mod) => {
  let dir = fs.readdirSync(ph.join(__dirname, mod)).filter(x => x.indexOf('.') >= 0)
  acc[mod] = dir.reduce((acc, item) => Object.assign(acc, require(ph.join(__dirname, mod, item))), {})
  module.exports = acc
  return acc
}, {})
