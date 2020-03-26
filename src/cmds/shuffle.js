/* global MediaPlayer */

module.exports = {
  name: 'shuffle',
  aliases: [],
  description: 'Shuffles the queue.',
  permissions: [],
  args: 0,
  usage: '',
  exec: async (msg, cmd) => {
    let player = MediaPlayer(msg.guild.id)
    let res = player.shuffle(player.queue)
    if (res && res.error) return msg.channel.send(res.error)
    return msg.channel.send('Shuffled the queue!')
  }
}
