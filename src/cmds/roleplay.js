let util = require('../util')
let dp = require('despair')

module.exports = {
  name: 'roleplay',
  aliases: ['chu', 'cuddle', 'hug', 'kiss', 'lewd', 'lick', 'nom', 'owo', 'pat', 'pout', 'ram', 'rem', 'slap', 'smug', 'stare', 'tickle'],
  description: 'Various ram.moe images to get from.',
  permissions: [],
  args: 0,
  usage: '',
  exec: async (msg, cmd) => {
    let type = cmd.name !== 'roleplay' ? cmd.name : null
    let opts = { nsfw: false }
    if (type) opts.type = type
    let body = await dp('https://rra.ram.moe/i/r', { query: opts }).json()
    if (body.error) throw Error(body.message)
    let img = await util.attachImages(['https://rra.ram.moe' + body.path])
    return msg.channel.send({ files: img })
  }
}
