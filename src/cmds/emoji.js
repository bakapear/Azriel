let util = require('../util')

module.exports = {
  name: 'emoji',
  aliases: ['e'],
  description: 'Displays an emoji from an emoji ID',
  permissions: [],
  args: 1,
  usage: '<id>',
  exec: async (msg, cmd) => {
    let url = `https://cdn.discordapp.com/emojis/${cmd.args[0]}`
    if (!await util.checkImage(url)) return msg.channel.send('Invalid emoji ID!')
    let img = await util.attachImages([url])
    return msg.channel.send({ files: img })
  }
}
