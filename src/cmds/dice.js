let { util } = require('../mod')

module.exports = {
  name: 'dice',
  aliases: ['roll'],
  description: 'Roll a dice',
  usage: '(max) | <min> <max>',
  async exec (msg, cmd) {
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
