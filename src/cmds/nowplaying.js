/* global MediaPlayer */

module.exports = {
  name: 'nowplaying',
  aliases: ['np'],
  description: 'Gets the current item in queue.',
  permissions: [],
  args: 0,
  usage: '',
  exec: async (msg, cmd) => {
    let player = MediaPlayer(msg.guild.id)
    if (!player.playing) return msg.channel.send(player.message('noplay').error)
    return player.message('nowplaying', player.queue[0], msg.channel)
  }
}
