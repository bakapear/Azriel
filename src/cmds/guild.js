/* global bot */
let util = require('../util')

module.exports = {
  name: 'guild',
  aliases: ['server'],
  description: `Gets information about the current guild you're in.`,
  permissions: [],
  args: 0,
  usage: '',
  exec: async (msg, cmd) => {
    let guild = bot.guilds.cache.get(msg.guild.id)
    return util.showEmbed(msg.channel, {
      title: guild.name,
      description: [
        `**Owner**: <@${guild.ownerID}>\n`,
        `**Members**: ${guild.members.cache.size}`,
        `**Channels**: ${guild.channels.cache.size}\n`,
        `**Roles**: ${guild.roles.cache.size}`,
        `**Emojis**: ${guild.emojis.cache.size}`
      ].join(' '),
      thumbnail: {
        url: guild.iconURL({ format: 'png', dynamic: true, size: 1024 })
      }
    })
  }
}
