let dp = require('despair')

module.exports = {
  poker: async (fn, cmd) => {
    let last = cmd.args[cmd.args.length - 1]
    if (!cmd.args.length) {
      let res = await fn(cmd.content)
      return res[Math.floor(Math.random() * res.length)]
    } else if (cmd.args.length > 1 && (!isNaN(last) || last === '?')) {
      let res = await fn(cmd.args.slice(0, cmd.args.length - 1).join(' '))
      let offset = Math.floor(Math.random() * res.length)
      if (!isNaN(last)) offset = parseInt(last) - 1
      if (offset >= res.length) offset = res.length - 1
      return res[offset]
    } else {
      let res = await fn(cmd.content)
      return res[0]
    }
  },
  attachImages: async arr => {
    for (let i = 0; i < arr.length; i++) {
      try {
        let res = await dp.head(arr[i])
        let ext = mimeTypes[res.headers['content-type']]
        if (ext) arr[i] = { attachment: arr[i], name: `unknown.${ext}` }
      } catch (e) {}
    }
    return arr
  }
}

let mimeTypes = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/bmp': 'bmp'
}
