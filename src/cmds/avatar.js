let { util } = require('../mod')

module.exports = {
  name: 'avatar',
  aliases: ['avt', 'pfp'],
  description: 'Get an avatar from a user',
  args: 1,
  usage: '<user>',
  async exec (msg, cmd) {
    let member = msg.guild.members.cache.find(x => x.user.username.toLowerCase().indexOf(cmd.content.toLowerCase()) >= 0)
    if (!member) return msg.channel.send('Couldn\'t find that user!')

    let url = member.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
    return util.sendImage(msg, url)
  }
}
