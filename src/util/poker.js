/* global cfg */

let rnd = require('./random.js')

let main = {
  poker: async (fn, cmd, opts = {}) => {
    if (cmd.prefix === cfg.prefix.random) opts.forceRandom = true
    let args = cmd.args.slice()
    let arg = x => args[args.length - x]
    let offset = (!isNaN(arg(1)) || arg(1) === '?') ? args.pop() : null
    let isList = arg(1) === '!'
    if (isList) args.pop()
    let search = args.join(' ')
    let items = await fn(search)
    if (opts.forceRandom || (!args.length && offset === null && !isList) || offset === '?') {
      offset = rnd.randomIndex(items)
    } else {
      if (offset === null) {
        if (!isList && opts.default && (opts.default === '?' || !isNaN(opts.default))) {
          if (opts.default === '?') offset = rnd.randomIndex(items)
          else offset = parseInt(offset)
        } else offset = 0
      } else offset = parseInt(offset) - 1
      if (offset >= items.length) offset = items.length - 1
      else if (offset < 0) offset = items.length + offset
      if (offset < 0) offset = 0
    }
    return { items, offset, isList, item: items[offset], search }
  }
}

module.exports = main
