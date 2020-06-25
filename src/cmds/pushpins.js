/* global bot */

module.exports = {
  name: 'pushpins',
  aliases: [''],
  description: 'Archives all pins into a channel.',
  permissions: ['BAN_MEMBERS'],
  args: 1,
  usage: '<channel>',
  exec: async (msg, cmd) => {
    let channel = await getChannel(cmd.args[0])
    if (!channel) return msg.channel.send('Invalid channel!')
    let pins = await msg.channel.messages.fetchPinned()
    let size = pins.size
    pins.forEach(async pin => {
      await new Promise(resolve => {
        setTimeout(() => {
          channel.send(`https://discordapp.com/channels/${msg.guild.id}/${pin.channel.id}/${pin.id}`).then(() => {
            // pin.delete().then(resolve)
            resolve()
          })
        }, 500)
      })
    })
    return msg.channel.send(`Moved ${size} pins to <#${channel.id}>`)
  }
}

async function getChannel (chan) {
  if (chan.startsWith('<#') && chan.endsWith('>')) {
    chan = chan.slice(2, -1)
    return bot.channels.cache.get(chan)
  }
  return null
}
