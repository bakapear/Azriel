let util = require('../util')
let dp = require('despair')
let key = process.env.GITHUB
let secret = process.env.GIST

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
        let res = await actions.list(user)
        if (res.constructor === String) return msg.channel.send(res)
        return util.showEmbed(msg.channel, {
          author: {
            name: `${msg.author.username}'s custom folders (${res.length})`,
            icon_url: msg.author.avatarURL()
          },
          footer: { text: res.map(x => `[${x[0]} (${x[1]}x)]`).join(' ') }
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
    let bin = await gist()
    if (!bin[user] || !Object.keys(bin[user]).length) return `You don't have any folders!`
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
    if (isNaN(index) || parseInt(index) > bin[user][folder].length || parseInt(index) < 1) {
      return `Index must be a number between 1-${bin[user][folder].length.length}!`
    }
    bin[user][folder].splice(parseInt(index) - 1, 1)
    await gist(bin)
    return `Removed item at #${index} from '${folder}'!`
  },
  custom: async (user, folder) => {
    let bin = await gist()
    if (!bin[user] || !Object.keys(bin[user]).length) return `You don't have any folders!`
    if (!folder) return [].concat.apply([], Object.values(bin[user]))
    if (!bin[user][folder]) return `The folder '${folder}' does not exist!`
    if (!bin[user][folder].length) return `The folder '${folder}' is empty!`
    return bin[user][folder]
  }
}

let cache = null

async function gist (data) {
  if (!data && cache) return cache
  let file = 'custom.json'
  let opts = {
    query: { access_token: key },
    headers: { 'User-Agent': 'Azriel' }
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
