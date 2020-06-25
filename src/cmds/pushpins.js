/* global bot */
let util = require('../util')

module.exports = {
  name: 'pushpins',
  aliases: [],
  description: 'Archives all pins into a channel.',
  permissions: ['BAN_MEMBERS'],
  args: 1,
  usage: '<channel>',
  exec: async (msg, cmd) => {
    let channel = await getChannel(cmd.args[0])
    if (!channel) return msg.channel.send('Invalid channel!')
    let pins = await msg.channel.messages.fetchPinned()
    let size = pins.size
    await pins.array().reverse().forEach(async pin => {
      await util.showEmbed(channel, {
        description: pin.content,
        image: {
          url: pin.attachments.first() ? pin.attachments.first().url : null
        },
        footer: {
          text: pin.author.username,
          icon_url: pin.author.avatarURL()
        },
        timestamp: pin.createdAt
      }, `> https://discordapp.com/channels/${msg.guild.id}/${pin.channel.id}/${pin.id}`)
      await pin.delete()
    })
    return msg.channel.send(`Moved ${size} pin${size === 1 ? '' : 's'} to <#${channel.id}>`)
  }
}

async function getChannel (chan) {
  if (chan.startsWith('<#') && chan.endsWith('>')) {
    chan = chan.slice(2, -1)
    return bot.channels.cache.get(chan)
  }
  return null
}
