let main = {
  rnd: x => x[Math.floor(Math.random() * x.length)],
  poker: async (fn, cmd) => {
    let last = cmd.args[cmd.args.length - 1]
    if (!cmd.args.length) {
      let res = await fn(cmd.content)
      return main.rnd(res)
    } else if (cmd.args.length > 1 && (!isNaN(last) || last === '?')) {
      let res = await fn(cmd.args.slice(0, cmd.args.length - 1).join(' '))
      let offset = main.rnd(res)
      if (!isNaN(last)) offset = parseInt(last) - 1
      if (offset >= res.length) offset = res.length - 1
      return res[offset]
    } else {
      let res = await fn(cmd.content)
      return res[0]
    }
  },
  attachImages: require('./attachImages.js')
}

module.exports = main
