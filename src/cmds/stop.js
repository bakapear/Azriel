/* global MediaPlayer */

module.exports = {
  name: 'stop',
  aliases: ['s'],
  description: 'Stops media playback and leaves voice channel.',
  permissions: [],
  args: 0,
  usage: '',
  exec: async (msg, cmd) => {
    let player = MediaPlayer(msg.guild.id)
    let res = await player.stop()
    if (res && res.error) return msg.channel.send(res.error)
    return res
  }
}
