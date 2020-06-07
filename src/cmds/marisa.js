let util = require('../util')

module.exports = {
  name: 'marisa',
  aliases: ['kirisame'],
  description: 'Displays marisa kirisame for ahmad.',
  permissions: [],
  args: 0,
  usage: '',
  exec: async (msg, cmd) => {
    let img = await util.attachImages(['https://i.imgur.com/aVf2qHc.png'])
    return msg.channel.send({ files: img })
  }
}
