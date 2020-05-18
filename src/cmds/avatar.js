/* global bot */

module.exports = {
  name: 'avatar',
  aliases: ['avt', 'pfp'],
  description: 'Gets an avatar from a user.',
  permissions: [],
  args: 1,
  usage: '<user>',
  exec: async (msg, cmd) => {
    let user = bot.users.cache.find(x => x.username.toLowerCase().indexOf(cmd.content.toLowerCase()) >= 0)
    if (user) return msg.channel.send({ files: [user.avatarURL({ format: 'png', dynamic: true, size: 1024 })] })
    return msg.channel.send('Couldn\'t find that user!')
  }
}
