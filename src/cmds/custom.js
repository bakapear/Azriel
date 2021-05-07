/* global cfg, env */

// big ugly port of old one for now
// TODO

let dp = require('despair')
let key = env.GITHUB
let secret = env.GIST

module.exports = {
  name: 'custom',
  aliases: ['c'],
  description: 'Gets an item from your own created folder.',
  permissions: [],
  args: 0,
  usage: '(folder) (poker) | add <media> (media) (...) | remove <index> | create/delete/clear <folder> | list | rename <folder> <name>',
  exec: async (msg, cmd) => {
    if (!secret) return
    let user = msg.author.id
    let arg = (cmd.args[0] || '').toLowerCase()
    switch (arg) {
      case 'create': {
        if (!cmd.args[1]) return msg.channel.send('Please input a folder name to create!')
        return msg.channel.send(await actions.create(user, cmd.args[1].toLowerCase()))
      }
      case 'delete': {
        if (!cmd.args[1]) return msg.channel.send('Please input a folder name to delete!')
        return msg.channel.send(await actions.delete(user, cmd.args[1].toLowerCase()))
      }
      case 'clear': {
        if (!cmd.args[1]) return msg.channel.send('Please input a folder name to clear!')
        return msg.channel.send(await actions.clear(user, cmd.args[1].toLowerCase()))
      }
      case 'rename': {
        if (!cmd.args[1]) return msg.channel.send('Please input a folder name to rename!')
        if (!cmd.args[2]) return msg.channel.send('Please input a new folder name to rename to!')
        return msg.channel.send(await actions.rename(user, cmd.args[1].toLowerCase(), cmd.args[2].toLowerCase()))
      }
      case 'list': {
        let res = await util.poker(() => actions.list(user), cmd)
        if (res.constructor === String) return msg.channel.send(res)
        return util.showEmbedList(msg.channel, res.items, res.offset, items => {
          return {
            author: {
              name: 'folders',
              icon_url: msg.author.avatarURL()
            },
            description: items.map((x, i) => `${i + res.offset + 1}. ${x[0]} (${x[1]}x)`).join('\n')
          }
        })
      }
      case 'add': {
        if (!cmd.args[1]) return msg.channel.send('Please input a folder to add items to!')
        if (!cmd.args[2]) return msg.channel.send('Please input atleast 1 item to add to the folder!')
        return msg.channel.send(await actions.add(user, cmd.args[1].toLowerCase(), cmd.args.slice(2)))
      }
      case 'remove': {
        if (!cmd.args[1]) return msg.channel.send('Please input a folder to remove items from!')
        if (!cmd.args[2]) return msg.channel.send('Please an index to remove!')
        return msg.channel.send(await actions.remove(user, cmd.args[1].toLowerCase(), cmd.args[2]))
      }
      default: {
        let res = await util.poker(x => actions.custom(user, x), cmd, { default: '?' })
        if (res.items.constructor === String) return msg.channel.send(res.items)
        if (res.isList) {
          return util.showEmbedList(msg.channel, res.items, res.offset, items => {
            return {
              author: {
                name: res.search || 'custom',
                icon_url: msg.author.avatarURL()
              },
              description: items.map((x, i) => `${i + 1}. ${x}`).join('\n')
            }
          })
        }
        return msg.channel.send(res.item)
      }
    }
  }
}

let actions = {
  create: async (user, folder) => {
    if (Object.keys(actions).includes(folder)) return 'Invalid folder name!'
    let bin = await gist()
    if (!bin[user]) bin[user] = {}
    if (bin[user][folder]) return `The folder '${folder}' already exists!`
    bin[user][folder] = []
    await gist(bin)
    return `Created folder '${folder}'!`
  },
  delete: async (user, folder) => {
    let bin = await gist()
    if (!bin[user] || !bin[user][folder]) return `The folder '${folder}' does not exist!`
    delete bin[user][folder]
    if (!Object.keys(bin[user]).length) delete bin[user]
    await gist(bin)
    return `Deleted folder '${folder}'!`
  },
  clear: async (user, folder) => {
    let bin = await gist()
    if (!bin[user] || !bin[user][folder]) return `The folder '${folder}' does not exist!`
    if (!bin[user][folder].length) return `The folder '${folder}' is already empty!`
    bin[user][folder] = []
    await gist(bin)
    return `Cleared folder '${folder}'!`
  },
  rename: async (user, folder, name) => {
    if (Object.keys(actions).includes(name)) return 'Invalid new folder name!'
    let bin = await gist()
    if (!bin[user] || !bin[user][folder]) return `The folder '${folder}' does not exist!`
    if (bin[user][name]) return `The folder '${name}' already exists!`
    bin[user][name] = bin[user][folder]
    delete bin[user][folder]
    await gist(bin)
    return `Renamed folder '${folder}' to '${name}'!`
  },
  list: async (user, folder) => {
    let bin = await gist(null, true)
    if (!bin[user] || !Object.keys(bin[user]).length) return 'You don\'t have any folders!'
    if (!folder) {
      return Object.entries(bin[user]).map(x => {
        x[1] = x[1].length
        return x
      })
    }
    if (!bin[user][folder]) return `The folder '${folder}' does not exist!`
    if (!bin[user][folder].length) return `The folder '${folder}' is empty!`
    return bin[user][folder]
  },
  add: async (user, folder, items) => {
    let bin = await gist()
    if (!bin[user] || !bin[user][folder]) return `The folder '${folder}' does not exist!`
    bin[user][folder].push(...items)
    await gist(bin)
    return `Added ${items.length} item${items.length === 1 ? '' : 's'} to '${folder}'!`
  },
  remove: async (user, folder, index) => {
    let bin = await gist()
    if (!bin[user] || !bin[user][folder]) return `The folder '${folder}' does not exist!`
    if (!bin[user][folder].length) return `The folder '${folder}' is empty!`
    if (isNaN(index) || parseInt(index) > bin[user][folder].length || parseInt(index) < -bin[user][folder].length) {
      return `Index must be a number between 1-${bin[user][folder].length}!`
    }
    bin[user][folder].splice(parseInt(index) - 1, 1)
    await gist(bin)
    return `Removed item at #${index} from '${folder}'!`
  },
  custom: async (user, folder) => {
    let bin = await gist(null, true)
    if (!bin[user] || !Object.keys(bin[user]).length) return 'You don\'t have any folders!'
    if (!folder) return [].concat.apply([], Object.values(bin[user]))
    if (!bin[user][folder]) return `The folder '${folder}' does not exist!`
    if (!bin[user][folder].length) return `The folder '${folder}' is empty!`
    return bin[user][folder]
  }
}

let cache = null

async function gist (data, quick) {
  if (quick && cache) return cache
  let file = 'custom.json'
  let opts = {
    headers: {
      'User-Agent': 'Azriel',
      Authorization: 'token ' + key
    }
  }
  if (data) {
    opts.method = 'PATCH'
    opts.type = 'json'
    opts.data = { files: {} }
    opts.data.files[file] = { content: JSON.stringify(data, null, 2) }
  }
  let body = await dp('https://api.github.com/gists/' + secret, opts).json()
  if (body.files[file].truncated) {
    let res = await dp(body.files[file].raw_url).text()
    cache = JSON.parse(res)
  }
  cache = JSON.parse(body.files[file].content)
  return cache
}

let rnd = {
  randomFloat: (min, max) => Math.random() * (max - min) + min,
  randomInt: (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  },
  randomIndex: arr => rnd.randomInt(0, arr.length - 1),
  randomItem: arr => arr[rnd.randomIndex(arr)]
}

let util = {
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
  },
  showEmbed: (chan, obj, content) => {
    return chan.send({
      embed: { ...obj },
      content: content || null
    })
  },
  showEmbedList: (chan, items, offset, fn, max = 10) => {
    let total = items.length
    items.splice(0, offset)
    if (items.length > max) items.length = max
    return util.showEmbed(chan, {
      ...fn(items),
      footer: { text: `Showing ${items.length} items (${offset} - ${total})` }
    })
  }
}
