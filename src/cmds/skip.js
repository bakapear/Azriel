/* global MediaPlayer */

module.exports = {
  name: 'skip',
  aliases: ['n', 'next'],
  description: 'Skips to next item in queue.',
  permissions: [],
  args: 0,
  usage: '',
  exec: async (msg, cmd) => {
    let player = MediaPlayer(msg.guild.id)
    let res = await player.skip()
    if (res && res.error) return msg.channel.send(res.error)
    return res
  }
}
