let util = require('../util')

module.exports = {
  name: 'roll',
  aliases: ['dice'],
  description: 'Rolls a dice.',
  permissions: [],
  args: 0,
  usage: '(max) | <min> <max>',
  exec: async (msg, cmd) => {
    let min = 1
    let max = 6
    if (!isNaN(cmd.args[0])) max = parseInt(cmd.args[0])
    if (!isNaN(cmd.args[1])) {
      min = max
      max = parseInt(cmd.args[1])
    }
    return msg.channel.send(`:game_die: Rolled a **${util.randomInt(min, max)}**!`)
  }
}
